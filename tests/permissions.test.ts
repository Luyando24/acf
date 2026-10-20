import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canAccessEntity,
  canEditPages,
  canExportSubmissions,
  canManageSettings,
  canManageStaff,
  canUpload,
  safeAdminRedirect,
} from '../src/lib/auth/permissions'
import { generateTempPassword } from '../src/lib/auth/passwords'

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

test('only super admins manage staff accounts', () => {
  assert.equal(canManageStaff('super_admin'), true)
  assert.equal(canManageStaff('admin'), false)
  assert.equal(canManageStaff('editor'), false)
  assert.equal(canManageStaff('contributor'), false)
  assert.equal(canManageStaff('viewer'), false)
})

test('temporary passwords are strong and unique per call', () => {
  const a = generateTempPassword()
  const b = generateTempPassword()
  assert.equal(a.length, 16)
  assert.notEqual(a, b)
  assert.match(a, /[a-z]/)
  assert.match(a, /[A-Z]/)
  assert.match(a, /[0-9]/)
  assert.match(a, /[!@#$%^&*]/)
})
