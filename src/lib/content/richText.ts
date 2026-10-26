const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'em', 'del', 'code', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'a', 'hr'])

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
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')

  const html: string[] = []
  let listTag: 'ul' | 'ol' | null = null
  const closeList = () => {
    if (listTag) {
      html.push(`</${listTag}>`)
      listTag = null
    }
  }

  for (const line of withInline.split('\n')) {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (listTag !== 'ul') {
        closeList()
        html.push('<ul>')
        listTag = 'ul'
      }
      html.push(`<li>${line.slice(2)}</li>`)
    } else if (/^\d+\.\s+/.test(line)) {
      if (listTag !== 'ol') {
        closeList()
        html.push('<ol>')
        listTag = 'ol'
      }
      html.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`)
    } else {
      closeList()
      if (line.startsWith('### ')) html.push(`<h3>${line.slice(4)}</h3>`)
      else if (line.startsWith('## ')) html.push(`<h2>${line.slice(3)}</h2>`)
      else if (line.startsWith('# ')) html.push(`<h1>${line.slice(2)}</h1>`)
      else if (line.startsWith('&gt; ')) html.push(`<blockquote>${line.slice(5)}</blockquote>`)
      else if (line.trim() === '---') html.push('<hr>')
      else if (line.trim() !== '') html.push(`<p>${line}</p>`)
    }
  }
  closeList()
  return html.join('')
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
}

function decodeEntities(value: string): string {
  return value.replace(/&(?:amp|lt|gt|quot|#39|#x27|apos|nbsp);/gi, (entity) => ENTITIES[entity] ?? entity)
}

function inlineToMarkdown(fragment: string): string {
  return fragment
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, inner) => `**${inlineToMarkdown(inner)}**`)
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, inner) => `*${inlineToMarkdown(inner)}*`)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, inner) => `\`${inner.replace(/<[^>]+>/g, '')}\``)
    .replace(
      /<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi,
      (_m, doubleQuoted, singleQuoted, label) =>
        `[${inlineToMarkdown(label).replace(/[[\]]/g, '')}](${doubleQuoted || singleQuoted || ''})`
    )
    .replace(/<[^>]+>/g, '')
}

/** Converts the legacy HTML subset stored in older records into editor markdown. */
export function htmlToMarkdown(html: string): string {
  let out = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')

  out = out.replace(
    /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi,
    (_m, tag: string, inner) => `\n\n${'#'.repeat(Number(tag[1]))} ${inlineToMarkdown(inner).trim()}\n\n`
  )

  out = out.replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, tag: string, inner) => {
    const ordered = tag.toLowerCase() === 'ol'
    const items: string[] = []
    const itemPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi
    let itemMatch: RegExpExecArray | null
    while ((itemMatch = itemPattern.exec(inner)) !== null) items.push(itemMatch[1])
    const lines = items.map(
      (item, index) => `${ordered ? `${index + 1}.` : '-'} ${inlineToMarkdown(item).trim()}`
    )
    return `\n\n${lines.join('\n')}\n\n`
  })

  out = out.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner) => {
    const text = inlineToMarkdown(inner.replace(/<\/?p[^>]*>/gi, ' ')).replace(/\s+/g, ' ').trim()
    return `\n\n> ${text}\n\n`
  })

  out = out.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, inner) => `\n\n${inlineToMarkdown(inner).trim()}\n\n`)
  out = out.replace(/<br\s*\/?>/gi, '\n')
  out = out.replace(/<hr[^>]*>/gi, '\n\n---\n\n')
  out = out.replace(/<[^>]+>/g, '')
  out = decodeEntities(out)

  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** Renders editor markdown, or a restricted subset of existing HTML, for public pages. */
export function renderRichText(source: string): string {
  if (!source.trim()) return ''
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeHtml(source)
  return markdownToHtml(escapeHtml(source))
}
