import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { renderRichText } from '../src/lib/content/richText'
import { allowRequest, safeRevalidatePath } from '../src/lib/security/requests'

test('renderRichText strips scripts and keeps safe markup', () => {
  const html = renderRichText('<p>Hello</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>')
  assert.equal(html.includes('<script'), false)
  assert.equal(html.includes('javascript:'), false)
  assert.equal(html.includes('<p>Hello</p>'), true)

  const markdown = renderRichText('## Policy brief')
  assert.equal(markdown.includes('<h2>Policy brief</h2>'), true)
  assert.equal(markdown.includes('<script>'), false)
})

test('revalidate paths stay on this site', () => {
  assert.equal(safeRevalidatePath('/news'), '/news')
  assert.equal(safeRevalidatePath('https://evil.example'), null)
  assert.equal(safeRevalidatePath('//evil.example'), null)
})

test('rate limit blocks the sixth call in a window', () => {
  const key = `test-${Date.now()}`
  for (let i = 0; i < 5; i += 1) assert.equal(allowRequest(key, 5, 60_000), true)
  assert.equal(allowRequest(key, 5, 60_000), false)
})

test('initial migration enables row level security on every app table', () => {
  const sql = readFileSync('supabase/migrations/20261020160000_initial_schema.sql', 'utf8')
  const tables = [
    'profiles',
    'site_settings',
    'pages',
    'people',
    'programmes',
    'publication_categories',
    'publications',
    'news_posts',
    'events',
    'opportunities',
    'partners',
    'membership_categories',
    'membership_applications',
    'contact_messages',
    'newsletter_subscribers',
    'activity_log',
  ]
  for (const table of tables) {
    assert.equal(sql.includes(`alter table public.${table} enable row level security`), true, table)
  }
  assert.equal(sql.includes("status = 'published'"), true)
})
