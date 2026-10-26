import test from 'node:test'
import assert from 'node:assert/strict'
import { verifyTurnstile } from '../src/lib/security/requests'

test('unconfigured Turnstile no longer blocks submissions', async () => {
  const prevSecret = process.env.TURNSTILE_SECRET_KEY
  delete process.env.TURNSTILE_SECRET_KEY
  try {
    assert.equal(await verifyTurnstile(undefined, '127.0.0.1'), null)
  } finally {
    if (prevSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY
    else process.env.TURNSTILE_SECRET_KEY = prevSecret
  }
})

test('configured Turnstile still requires a token', async () => {
  const prevSecret = process.env.TURNSTILE_SECRET_KEY
  process.env.TURNSTILE_SECRET_KEY = 'real-secret-value-not-for-production'
  try {
    assert.equal(await verifyTurnstile(undefined, '127.0.0.1'), 'Please complete the spam check.')
  } finally {
    if (prevSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY
    else process.env.TURNSTILE_SECRET_KEY = prevSecret
  }
})
