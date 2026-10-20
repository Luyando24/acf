const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'a', 'hr'])

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function safeUrl(url: string): string | null {
  const trimmed = url.trim()
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^mailto:/i.test(trimmed)) return trimmed
  return null
}

export function sanitizeHtml(input: string): string {
  const stripped = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')

  return stripped.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (match, rawTag: string, rawAttrs = '') => {
    const tag = rawTag.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) return ''
    if (match.startsWith('</')) return `</${tag}>`
    if (tag === 'br' || tag === 'hr') return `<${tag}>`
    if (tag !== 'a') return `<${tag}>`

    const hrefMatch = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(rawAttrs)
    const href = safeUrl(hrefMatch?.[1] || hrefMatch?.[2] || '')
    if (!href) return '<a>'
    return `<a href="${escapeHtml(href)}" rel="noopener noreferrer">`
  })
}

function markdownToHtml(escaped: string): string {
  const withInline = escaped
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, url: string) => {
      const href = safeUrl(url.replace(/&amp;/g, '&'))
      if (!href) return label
      return `<a href="${escapeHtml(href)}" rel="noopener noreferrer">${label}</a>`
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return withInline
    .split('\n')
    .map((line) => {
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('&gt; ')) return `<blockquote>${line.slice(5)}</blockquote>`
      if (line.startsWith('- ') || line.startsWith('* ')) return `<li>${line.slice(2)}</li>`
      if (line.trim() === '') return ''
      return `<p>${line}</p>`
    })
    .join('')
}

/** Renders editor markdown, or a restricted subset of existing HTML, for public pages. */
export function renderRichText(source: string): string {
  if (!source.trim()) return ''
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeHtml(source)
  return markdownToHtml(escapeHtml(source))
}
