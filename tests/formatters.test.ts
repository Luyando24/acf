import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatDate,
  formatCurrencyZMW,
  formatFileSize,
  isOpportunityClosed,
} from '../src/lib/utils/formatters'

test('formatDate correctly formats date in DD Month YYYY in Africa/Lusaka locale', () => {
  const result = formatDate('2026-03-01T08:00:00Z')
  assert.match(result, /01 March 2026|1 March 2026/)
})

test('formatCurrencyZMW correctly formats Zambian Kwacha', () => {
  const result = formatCurrencyZMW(5000)
  assert.ok(result.includes('5,000') || result.includes('5.000'))
})

test('formatFileSize formats byte units properly', () => {
  assert.equal(formatFileSize(0), '0 B')
  assert.equal(formatFileSize(1024), '1 KB')
  assert.equal(formatFileSize(1048576), '1 MB')
})

test('isOpportunityClosed correctly identifies past dates as closed and future as active', () => {
  // A closing date in 2020 should definitely be closed
  assert.equal(isOpportunityClosed('2020-01-01'), true)

  // A closing date in 2030 should be active
  assert.equal(isOpportunityClosed('2030-12-31'), false)
})
