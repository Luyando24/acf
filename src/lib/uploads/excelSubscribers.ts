import { inflateRawSync } from 'node:zlib'

export interface ParsedSubscriberRow {
  email: string
  status: 'subscribed' | 'unsubscribed' | 'pending'
  source: string
}

export interface SpreadsheetParseResult {
  subscribers: ParsedSubscriberRow[]
  totalRowsExamined: number
  invalidOrSkippedCount: number
  duplicateInFileCount: number
}

const EMAIL_EXACT_REGEX = /^[^\s@,;<>"]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const EMAIL_FIND_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function normalizeStatus(
  raw: string | undefined,
  fallback: 'subscribed' | 'unsubscribed' | 'pending'
): 'subscribed' | 'unsubscribed' | 'pending' {
  if (!raw) return fallback
  const val = raw.trim().toLowerCase()
  if (val === 'subscribed' || val === 'active' || val === 'confirmed' || val === 'yes') {
    return 'subscribed'
  }
  if (val === 'unsubscribed' || val === 'inactive' || val === 'opted_out' || val === 'no') {
    return 'unsubscribed'
  }
  if (val === 'pending' || val === 'unconfirmed') {
    return 'pending'
  }
  return fallback
}

/**
 * Extracts text entries from a ZIP buffer (.xlsx) using the Central Directory.
 */
function extractZipXmlEntries(bytes: Uint8Array): Map<string, string> {
  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const entries = new Map<string, string>()

  // Locate End of Central Directory (EOCD: 0x06054b50)
  let eocdOffset = -1
  const minSearch = Math.max(0, buf.length - 65557)
  for (let i = buf.length - 22; i >= minSearch; i--) {
    if (
      buf[i] === 0x50 &&
      buf[i + 1] === 0x4b &&
      buf[i + 2] === 0x05 &&
      buf[i + 3] === 0x06
    ) {
      eocdOffset = i
      break
    }
  }

  if (eocdOffset === -1) {
    return entries
  }

  const totalEntries = buf.readUInt16LE(eocdOffset + 10)
  const cdOffset = buf.readUInt32LE(eocdOffset + 16)

  let ptr = cdOffset
  for (let idx = 0; idx < totalEntries && ptr + 46 <= buf.length; idx++) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break

    const compressionMethod = buf.readUInt16LE(ptr + 10)
    const compressedSize = buf.readUInt32LE(ptr + 20)
    const fileNameLen = buf.readUInt16LE(ptr + 28)
    const extraLen = buf.readUInt16LE(ptr + 30)
    const commentLen = buf.readUInt16LE(ptr + 32)
    const localHeaderOffset = buf.readUInt32LE(ptr + 42)

    const fileName = buf.subarray(ptr + 46, ptr + 46 + fileNameLen).toString('utf8')
    ptr += 46 + fileNameLen + extraLen + commentLen

    if (
      !fileName.startsWith('xl/sharedStrings') &&
      !fileName.startsWith('xl/worksheets/sheet')
    ) {
      continue
    }

    if (localHeaderOffset + 30 > buf.length) continue
    if (buf.readUInt32LE(localHeaderOffset) !== 0x04034b50) continue

    const localNameLen = buf.readUInt16LE(localHeaderOffset + 26)
    const localExtraLen = buf.readUInt16LE(localHeaderOffset + 28)
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen
    const dataEnd = dataStart + compressedSize

    if (dataEnd > buf.length) continue
    const slice = buf.subarray(dataStart, dataEnd)

    try {
      if (compressionMethod === 0) {
        entries.set(fileName, slice.toString('utf8'))
      } else if (compressionMethod === 8) {
        const inflated = inflateRawSync(slice)
        entries.set(fileName, inflated.toString('utf8'))
      }
    } catch {
      // Skip corrupted entry
    }
  }

  return entries
}

function parseXlsxRows(bytes: Uint8Array): string[][] {
  const entries = extractZipXmlEntries(bytes)
  const sharedStrings: string[] = []

  const sstXml = entries.get('xl/sharedStrings.xml')
  if (sstXml) {
    const siMatches = sstXml.match(/<si[\s>][\s\S]*?<\/si>/g) || []
    for (const si of siMatches) {
      const tMatches = Array.from(si.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g))
      const combined = tMatches.map((m) => decodeXmlEntities(m[1])).join('')
      sharedStrings.push(combined)
    }
  }

  const rows: string[][] = []
  for (const [name, xml] of entries.entries()) {
    if (!name.startsWith('xl/worksheets/sheet')) continue
    const rowMatches = xml.match(/<row[\s>][\s\S]*?<\/row>/g) || []
    for (const rowXml of rowMatches) {
      const cells: string[] = []
      const cellMatches = Array.from(rowXml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g))
      for (const cellMatch of cellMatches) {
        const attrs = cellMatch[1] || ''
        const inner = cellMatch[2] || ''
        const typeMatch = attrs.match(/\bt="([^"]+)"/)
        const cellType = typeMatch ? typeMatch[1] : ''

        let value = ''
        if (cellType === 's') {
          const vMatch = inner.match(/<v>(\d+)<\/v>/)
          if (vMatch) {
            const sstIdx = Number(vMatch[1])
            value = sharedStrings[sstIdx] ?? ''
          }
        } else if (cellType === 'inlineStr') {
          const tMatches = Array.from(inner.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g))
          value = tMatches.map((m) => decodeXmlEntities(m[1])).join('')
        } else {
          const vMatch = inner.match(/<v>([\s\S]*?)<\/v>/)
          if (vMatch) {
            value = decodeXmlEntities(vMatch[1])
          }
        }
        cells.push(value.trim())
      }
      if (cells.some((c) => c.length > 0)) {
        rows.push(cells)
      }
    }
  }

  return rows
}

function parseDelimitedLine(line: string, delimiter: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === delimiter && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  cells.push(current.trim())
  return cells
}

function parseCsvOrTextRows(text: string): string[][] {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return []

  const sample = lines[0]
  const delimiter = sample.includes('\t')
    ? '\t'
    : sample.split(';').length > sample.split(',').length
    ? ';'
    : ','

  return lines.map((line) => parseDelimitedLine(line, delimiter))
}

function parseLegacyXlsRows(bytes: Uint8Array): string[][] {
  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const asciiText = buf.toString('latin1')
  const utf16Text = buf.toString('utf16le')

  const found = new Set<string>()
  for (const match of asciiText.matchAll(EMAIL_FIND_REGEX)) {
    found.add(match[0].toLowerCase())
  }
  for (const match of utf16Text.matchAll(EMAIL_FIND_REGEX)) {
    found.add(match[0].toLowerCase())
  }

  return Array.from(found).map((email) => [email])
}

/**
 * Parses subscriber rows from an uploaded Excel (.xlsx, .xls) or CSV (.csv) file.
 */
export function parseSubscribersFromSpreadsheet(
  bytes: Uint8Array,
  filename: string,
  defaultStatus: 'subscribed' | 'unsubscribed' | 'pending' = 'subscribed',
  defaultSource: string = 'excel_upload'
): SpreadsheetParseResult {
  const ext = (filename.split('.').pop() || '').toLowerCase()
  const isZip =
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  const isOle =
    bytes.length >= 8 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0

  let rows: string[][] = []
  if (isZip || ext === 'xlsx') {
    rows = parseXlsxRows(bytes)
  } else if (isOle) {
    rows = parseLegacyXlsRows(bytes)
  } else {
    const text = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('utf8')
    rows = parseCsvOrTextRows(text)
  }

  // Detect optional header column indices
  let emailCol = -1
  let statusCol = -1
  let sourceCol = -1
  let startRow = 0

  if (rows.length > 0) {
    const firstRowLower = rows[0].map((c) => c.toLowerCase().replace(/[^a-z0-9_]/g, ''))
    const hasEmailHeader = firstRowLower.some(
      (h) => h === 'email' || h === 'emailaddress' || h === 'e_mail' || h === 'subscriber'
    )
    const firstRowHasActualEmail = rows[0].some((c) => EMAIL_EXACT_REGEX.test(c.trim()))

    if (hasEmailHeader && !firstRowHasActualEmail) {
      startRow = 1
      emailCol = firstRowLower.findIndex(
        (h) => h === 'email' || h === 'emailaddress' || h === 'e_mail' || h === 'subscriber'
      )
      statusCol = firstRowLower.findIndex((h) => h === 'status' || h === 'subscriptionstatus')
      sourceCol = firstRowLower.findIndex(
        (h) => h === 'source' || h === 'channel' || h === 'sourcechannel'
      )
    }
  }

  const seenEmails = new Set<string>()
  const subscribers: ParsedSubscriberRow[] = []
  let invalidOrSkippedCount = 0
  let duplicateInFileCount = 0
  let totalRowsExamined = 0

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.every((c) => !c || !c.trim())) continue
    totalRowsExamined++

    let email = ''
    if (emailCol >= 0 && row[emailCol] && EMAIL_EXACT_REGEX.test(row[emailCol].trim())) {
      email = row[emailCol].trim().toLowerCase()
    } else {
      for (const cell of row) {
        const cleaned = cell.trim().replace(/^mailto:/i, '').trim()
        if (EMAIL_EXACT_REGEX.test(cleaned)) {
          email = cleaned.toLowerCase()
          break
        }
        const embedded = cleaned.match(EMAIL_FIND_REGEX)
        if (embedded && embedded[0]) {
          email = embedded[0].toLowerCase()
          break
        }
      }
    }

    if (!email || !EMAIL_EXACT_REGEX.test(email)) {
      invalidOrSkippedCount++
      continue
    }

    if (seenEmails.has(email)) {
      duplicateInFileCount++
      continue
    }
    seenEmails.add(email)

    const rawStatus =
      statusCol >= 0 && row[statusCol]
        ? row[statusCol]
        : row.find((c) => /^(subscribed|unsubscribed|pending|active|inactive)$/i.test(c.trim()))

    const rawSource =
      sourceCol >= 0 && row[sourceCol] && row[sourceCol].trim() !== email
        ? row[sourceCol].trim()
        : defaultSource

    subscribers.push({
      email,
      status: normalizeStatus(rawStatus, defaultStatus),
      source: rawSource || defaultSource,
    })
  }

  return {
    subscribers,
    totalRowsExamined,
    invalidOrSkippedCount,
    duplicateInFileCount,
  }
}

