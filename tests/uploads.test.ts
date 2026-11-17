import test from 'node:test'
import assert from 'node:assert/strict'
import { deflateRawSync } from 'node:zlib'
import { isStoredObject, randomObjectName, validateUpload } from '../src/lib/uploads/policy'
import { parseSubscribersFromSpreadsheet } from '../src/lib/uploads/excelSubscribers'

const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const pdf = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])
const html = Uint8Array.from(new TextEncoder().encode('<svg><script>alert(1)</script></svg>'))

test('validateUpload accepts a real PNG and hides the original name', () => {
  const result = validateUpload({
    filename: '../secret report.png',
    declaredMime: 'image/png',
    size: png.byteLength,
    bytes: png,
    requestedKind: 'image',
  })

  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.bucket, 'public-media')
  assert.match(result.objectName, /^[0-9a-f-]{36}\.png$/)
  assert.equal(result.objectName.includes('secret'), false)
})

test('validateUpload rejects SVG and mismatched contents', () => {
  const svg = validateUpload({
    filename: 'logo.svg',
    declaredMime: 'image/svg+xml',
    size: html.byteLength,
    bytes: html,
  })
  assert.equal(svg.ok, false)

  const spoofed = validateUpload({
    filename: 'photo.png',
    declaredMime: 'image/png',
    size: html.byteLength,
    bytes: html,
  })
  assert.equal(spoofed.ok, false)
})

test('validateUpload keeps documents private and enforces the image size cap', () => {
  const document = validateUpload({
    filename: 'brief.pdf',
    declaredMime: 'application/pdf',
    size: pdf.byteLength,
    bytes: pdf,
    requestedKind: 'document',
  })
  assert.equal(document.ok, true)
  if (document.ok) assert.equal(document.bucket, 'private-uploads')

  const huge = validateUpload({
    filename: 'cover.jpg',
    declaredMime: 'image/jpeg',
    size: 16 * 1024 * 1024,
    bytes: Uint8Array.from([0xff, 0xd8, 0xff, 0xd9]),
  })
  assert.equal(huge.ok, false)
})

test('stored object names cannot leave the two upload buckets', () => {
  const name = randomObjectName('pdf')
  assert.equal(isStoredObject('private-uploads', name), true)
  assert.equal(isStoredObject('public-media', '../etc/passwd'), false)
  assert.equal(isStoredObject('other-bucket', name), false)
})

function buildMinimalXlsx(entries: Array<{ name: string; content: string }>): Buffer {
  const localParts: Buffer[] = []
  const centralParts: Buffer[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8')
    const rawBuf = Buffer.from(entry.content, 'utf8')
    const compBuf = deflateRawSync(rawBuf)

    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0, 6)
    localHeader.writeUInt16LE(8, 8) // Deflate
    localHeader.writeUInt32LE(compBuf.length, 18)
    localHeader.writeUInt32LE(rawBuf.length, 22)
    localHeader.writeUInt16LE(nameBuf.length, 26)
    localHeader.writeUInt16LE(0, 28)

    localParts.push(localHeader, nameBuf, compBuf)

    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0)
    centralHeader.writeUInt16LE(20, 4)
    centralHeader.writeUInt16LE(20, 6)
    centralHeader.writeUInt16LE(0, 8)
    centralHeader.writeUInt16LE(8, 10)
    centralHeader.writeUInt32LE(compBuf.length, 20)
    centralHeader.writeUInt32LE(rawBuf.length, 24)
    centralHeader.writeUInt16LE(nameBuf.length, 28)
    centralHeader.writeUInt32LE(offset, 42)

    centralParts.push(centralHeader, nameBuf)
    offset += localHeader.length + nameBuf.length + compBuf.length
  }

  const centralDir = Buffer.concat(centralParts)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(entries.length, 8)
  eocd.writeUInt16LE(entries.length, 10)
  eocd.writeUInt32LE(centralDir.length, 12)
  eocd.writeUInt32LE(offset, 16)

  return Buffer.concat([...localParts, centralDir, eocd])
}

test('parseSubscribersFromSpreadsheet extracts subscribers from CSV and XLSX workbooks', () => {
  const csvBuffer = Buffer.from(
    'Email,Status,Source\nfarmer.one@zambia.org.zm,confirmed,Policy Dialogue\nFARMER.ONE@zambia.org.zm,pending,Duplicate\nagri.lead@acf.org.zm,pending,Event Registration\nnot-an-email,subscribed,Test\n',
    'utf8'
  )

  const csvResult = parseSubscribersFromSpreadsheet(csvBuffer, 'subscribers.csv')
  assert.equal(csvResult.subscribers.length, 2)
  assert.equal(csvResult.duplicateInFileCount, 1)
  assert.equal(csvResult.invalidOrSkippedCount, 1)
  assert.deepEqual(csvResult.subscribers[0], {
    email: 'farmer.one@zambia.org.zm',
    status: 'subscribed',
    source: 'Policy Dialogue',
  })
  assert.deepEqual(csvResult.subscribers[1], {
    email: 'agri.lead@acf.org.zm',
    status: 'pending',
    source: 'Event Registration',
  })

  const xlsxBuffer = buildMinimalXlsx([
    {
      name: 'xl/sharedStrings.xml',
      content:
        '<?xml version="1.0" encoding="UTF-8"?><sst><si><t>Email</t></si><si><t>Status</t></si><si><t>Source</t></si><si><t>member@agriforum.zm</t></si><si><t>subscribed</t></si><si><t>Excel Upload</t></si><si><t>unsub@agriforum.zm</t></si><si><t>unsubscribed</t></si></sst>',
    },
    {
      name: 'xl/worksheets/sheet1.xml',
      content:
        '<?xml version="1.0" encoding="UTF-8"?><worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c></row><row r="2"><c r="A2" t="s"><v>3</v></c><c r="B2" t="s"><v>4</v></c><c r="C2" t="s"><v>5</v></c></row><row r="3"><c r="A3" t="s"><v>6</v></c><c r="B3" t="s"><v>7</v></c></row></sheetData></worksheet>',
    },
  ])

  const xlsxResult = parseSubscribersFromSpreadsheet(
    xlsxBuffer,
    'subscribers.xlsx',
    'subscribed',
    'Excel Import'
  )
  assert.equal(xlsxResult.subscribers.length, 2)
  assert.deepEqual(xlsxResult.subscribers[0], {
    email: 'member@agriforum.zm',
    status: 'subscribed',
    source: 'Excel Upload',
  })
  assert.deepEqual(xlsxResult.subscribers[1], {
    email: 'unsub@agriforum.zm',
    status: 'unsubscribed',
    source: 'Excel Import',
  })
})
