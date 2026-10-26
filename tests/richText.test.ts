import test from 'node:test'
import assert from 'node:assert/strict'
import { htmlToMarkdown, renderRichText } from '../src/lib/content/richText'

test('htmlToMarkdown converts the legacy HTML subset', () => {
  const html =
    '<p>Intro <strong>bold</strong> and <a href="https://example.org">link</a>.</p>' +
    '<ul><li>One</li><li>Two</li></ul>' +
    '<ol><li>First</li></ol>' +
    '<h2>Title</h2>' +
    '<blockquote>Quote</blockquote>'

  const markdown = htmlToMarkdown(html)

  assert.match(markdown, /Intro \*\*bold\*\* and \[link\]\(https:\/\/example\.org\)\./)
  assert.match(markdown, /- One\n- Two/)
  assert.match(markdown, /1\. First/)
  assert.match(markdown, /## Title/)
  assert.match(markdown, /> Quote/)
  assert.ok(!/<p>|<ul>|<h2>/.test(markdown))
})

test('renderRichText renders markdown lists and inline formatting', () => {
  const html = renderRichText('## Heading\n\nSome **bold** text.\n\n- one\n- two\n\n1. first')

  assert.match(html, /<h2>Heading<\/h2>/)
  assert.match(html, /<strong>bold<\/strong>/)
  assert.match(html, /<ul><li>one<\/li><li>two<\/li><\/ul>/)
  assert.match(html, /<ol><li>first<\/li><\/ol>/)
})

test('renderRichText keeps sanitizing legacy HTML', () => {
  const html = renderRichText(
    '<p onclick="x()">Hi<script>alert(1)</script></p><a href="javascript:alert(1)">x</a>'
  )

  assert.ok(!/script|onclick|javascript:/i.test(html))
  assert.match(html, /<p>Hi<\/p>/)
})
