import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canAccessEntity,
  canEditPages,
  canExportSubmissions,
  canManageSettings,
  canUpload,
  safeAdminRedirect,
} from '../src/lib/auth/permissions'

test('safeAdminRedirect stays inside the admin area', () => {
  assert.equal(safeAdminRedirect('/admin/news'), '/admin/news')
  assert.equal(safeAdminRedirect('https://evil.example/admin'), '/admin')
  assert.equal(safeAdminRedirect('//evil.example'), '/admin')
  assert.equal(safeAdminRedirect('/about'), '/admin')
  assert.equal(safeAdminRedirect('/admin/login'), '/admin')
  assert.equal(safeAdminRedirect(null), '/admin')
})

test('viewers can read submissions and cannot write', () => {
  assert.equal(canAccessEntity('viewer', 'contacts', 'GET'), true)
  assert.equal(canAccessEntity('viewer', 'news', 'POST'), false)
  assert.equal(canUpload('viewer'), false)
  assert.equal(canExportSubmissions('viewer'), false)
})

test('editors manage content and cannot export submissions or settings', () => {
  assert.equal(canAccessEntity('editor', 'news', 'DELETE'), true)
  assert.equal(canAccessEntity('editor', 'membership', 'GET'), false)
  assert.equal(canEditPages('editor'), true)
  assert.equal(canManageSettings('editor'), false)
  assert.equal(canExportSubmissions('editor'), false)
})

test('admins manage submissions and only super admins manage settings', () => {
  assert.equal(canAccessEntity('admin', 'newsletter', 'PATCH'), true)
  assert.equal(canExportSubmissions('admin'), true)
  assert.equal(canManageSettings('admin'), false)
  assert.equal(canManageSettings('super_admin'), true)
  assert.equal(canAccessEntity('contributor', 'publications', 'POST'), true)
  assert.equal(canAccessEntity('contributor', 'publications', 'DELETE'), false)
})
