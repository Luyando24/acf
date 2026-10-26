export const PUBLIC_MEDIA_BUCKET = 'public-media'
export const PRIVATE_UPLOADS_BUCKET = 'private-uploads'

export const IMAGE_MAX_BYTES = 15 * 1024 * 1024
export const DOCUMENT_MAX_BYTES = 50 * 1024 * 1024

export type UploadKind = 'image' | 'document'

type Rule = {
  kind: UploadKind
  mimes: string[]
  matches: (bytes: Uint8Array) => boolean
}

const startsWith = (bytes: Uint8Array, signature: number[]) =>
  signature.every((byte, index) => bytes[index] === byte)

const isJpeg = (bytes: Uint8Array) => startsWith(bytes, [0xff, 0xd8, 0xff])
const isPng = (bytes: Uint8Array) => startsWith(bytes, [0x89, 0x50, 0x4e, 0x47])
const isGif = (bytes: Uint8Array) =>
  startsWith(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
  startsWith(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
const isWebp = (bytes: Uint8Array) =>
  startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
  bytes[8] === 0x57 &&
  bytes[9] === 0x45 &&
  bytes[10] === 0x42 &&
  bytes[11] === 0x50
const isPdf = (bytes: Uint8Array) => startsWith(bytes, [0x25, 0x50, 0x44, 0x46])
const isOle = (bytes: Uint8Array) => startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
const isZip = (bytes: Uint8Array) =>
  startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
  startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
  startsWith(bytes, [0x50, 0x4b, 0x07, 0x08])

const RULES: Record<string, Rule> = {
  png: { kind: 'image', mimes: ['image/png'], matches: isPng },
  jpg: { kind: 'image', mimes: ['image/jpeg'], matches: isJpeg },
  jpeg: { kind: 'image', mimes: ['image/jpeg'], matches: isJpeg },
  webp: { kind: 'image', mimes: ['image/webp'], matches: isWebp },
  gif: { kind: 'image', mimes: ['image/gif'], matches: isGif },
  pdf: { kind: 'document', mimes: ['application/pdf'], matches: isPdf },
  doc: { kind: 'document', mimes: ['application/msword'], matches: isOle },
  xls: { kind: 'document', mimes: ['application/vnd.ms-excel'], matches: isOle },
  ppt: { kind: 'document', mimes: ['application/vnd.ms-powerpoint'], matches: isOle },
  docx: {
    kind: 'document',
    mimes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    matches: isZip,
  },
  xlsx: {
    kind: 'document',
    mimes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    matches: isZip,
  },
  pptx: {
    kind: 'document',
    mimes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    matches: isZip,
  },
}

const GENERIC_MIMES = new Set(['', 'application/octet-stream'])

export function extensionOf(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || ''
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return ''
  return base.slice(dot + 1).toLowerCase()
}

export function randomObjectName(extension: string): string {
  return `${crypto.randomUUID()}.${extension}`
}

export function bucketFor(kind: UploadKind): string {
  return kind === 'image' ? PUBLIC_MEDIA_BUCKET : PRIVATE_UPLOADS_BUCKET
}

export interface UploadCheck {
  ok: true
  kind: UploadKind
  extension: string
  mimeType: string
  bucket: string
  objectName: string
}

export function validateUpload(input: {
  filename: string
  declaredMime: string
  size: number
  bytes: Uint8Array
  requestedKind?: string
}): UploadCheck | { ok: false; error: string } {
  const extension = extensionOf(input.filename)
  const rule = RULES[extension]
  if (!rule) {
    return {
      ok: false,
      error: 'File type is not supported. Use PNG, JPG, WebP, GIF, PDF, Word, Excel, or PowerPoint.',
    }
  }

  if (input.requestedKind && input.requestedKind !== rule.kind) {
    return { ok: false, error: `This field only accepts ${input.requestedKind} files.` }
  }

  const limit = rule.kind === 'image' ? IMAGE_MAX_BYTES : DOCUMENT_MAX_BYTES
  if (input.size > limit) {
    const maxMb = limit / (1024 * 1024)
    return { ok: false, error: `File is larger than the ${maxMb}MB limit.` }
  }

  const declared = input.declaredMime.toLowerCase().split(';')[0].trim()
  if (!GENERIC_MIMES.has(declared) && !rule.mimes.includes(declared)) {
    return { ok: false, error: 'The file contents do not match the declared type.' }
  }

  if (!rule.matches(input.bytes)) {
    return { ok: false, error: 'The file contents do not match its extension.' }
  }

  return {
    ok: true,
    kind: rule.kind,
    extension,
    mimeType: rule.mimes[0],
    bucket: bucketFor(rule.kind),
    objectName: randomObjectName(extension),
  }
}

const OBJECT_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/

export function isStoredObject(bucket: string, objectName: string): boolean {
  if (bucket !== PUBLIC_MEDIA_BUCKET && bucket !== PRIVATE_UPLOADS_BUCKET) return false
  return OBJECT_NAME.test(objectName)
}

const STORED_FILE_URL = new RegExp(
  `^/api/files/(${PUBLIC_MEDIA_BUCKET}|${PRIVATE_UPLOADS_BUCKET})/[^/]+$`
)

export function parseStoredFileUrl(url: string): { bucket: string; objectName: string } | null {
  const match = url.match(STORED_FILE_URL)
  if (!match) return null
  const objectName = url.slice(url.lastIndexOf('/') + 1)
  if (!isStoredObject(match[1], objectName)) return null
  return { bucket: match[1], objectName }
}

// Local asset paths (e.g. /documents/report.pdf) only work if the file is committed to public/;
// uploads and external links are the supported sources.
export function isServableDocumentPath(filePath: string): boolean {
  return Boolean(parseStoredFileUrl(filePath)) || /^https?:\/\/\S+$/i.test(filePath)
}
