import test from 'node:test'
import assert from 'node:assert/strict'
import { isStoredObject, randomObjectName, validateUpload } from '../src/lib/uploads/policy'

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
