'use client'

import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code,
  Eye,
  Edit3,
  Columns,
  AlertCircle,
} from 'lucide-react'
import { htmlToMarkdown, renderRichText } from '@/lib/content/richText'

interface RichTextEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  error?: string
  required?: boolean
  description?: string
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Write content here...',
  rows = 10,
  error,
  required = false,
  description,
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Records saved before this editor existed hold HTML; convert on the fly so the
  // textarea shows markdown instead of raw tags. The first edit persists markdown.
  const legacyHtml = /<\/?[a-z][^>]*>/i.test(value)
  const editorValue = legacyHtml ? htmlToMarkdown(value) : value

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editorValue.substring(start, end) || defaultText

    const replacement = `${prefix}${selectedText}${suffix}`
    const newValue = editorValue.substring(0, start) + replacement + editorValue.substring(end)

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 10)
  }

  const handleInsertLink = () => {
    const url = prompt('Enter destination URL (e.g. https://example.com):', 'https://')
    if (url && url !== 'https://') {
      const textarea = textareaRef.current
      const selectedText = textarea ? editorValue.substring(textarea.selectionStart, textarea.selectionEnd) : ''
      const linkText = selectedText || prompt('Enter link display text:', 'link text') || 'link'
      insertFormatting(`[${linkText}](${url})`)
    }
  }

  // Word count & read time calculations
  const cleanText = editorValue.trim()
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  const preview = (
    <div className="p-5 min-h-[220px] bg-white overflow-y-auto max-h-[500px] prose-acf">
      {editorValue.trim() ? (
        <div dangerouslySetInnerHTML={{ __html: renderRichText(editorValue) }} />
      ) : (
        <p className="text-gray-400 italic">No content to preview yet.</p>
      )}
    </div>
  )

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-bold text-[#0f1d14]">
            {label} {required && <span className="text-rose-600">*</span>}
          </label>
          {description && <p className="text-xs text-[#5c6f62]">{description}</p>}
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 text-[11px] bg-[#f6f9f6] p-0.5 rounded-lg border border-[#e2ebe4]">
          <button
            type="button"
            onClick={() => setViewMode('write')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              viewMode === 'write'
                ? 'bg-white text-[#175432] shadow-xs'
                : 'text-[#5c6f62] hover:text-[#0f1d14]'
            }`}
          >
            <Edit3 size={11} />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-[#175432] shadow-xs'
                : 'text-[#5c6f62] hover:text-[#0f1d14]'
            }`}
          >
            <Eye size={11} />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden sm:flex px-2 py-0.5 rounded font-semibold transition-colors items-center gap-1 cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-[#175432] shadow-xs'
                : 'text-[#5c6f62] hover:text-[#0f1d14]'
            }`}
          >
            <Columns size={11} />
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div
        className={`rounded-lg border transition-all overflow-hidden ${
          error
            ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-500 bg-rose-50/20'
            : 'border-[#e2ebe4] focus-within:ring-2 focus-within:ring-[#175432] bg-white'
        }`}
      >
        {/* Formatting Toolbar */}
        <div className="bg-[#f6f9f6] px-3 py-2 border-b border-[#e2ebe4] flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-0.5 border-r border-[#e2ebe4] pr-1.5 mr-1">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'bold text')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Bold (**text**)"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'italic text')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Italic (*text*)"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('~~', '~~', 'strikethrough')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough size={14} />
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-[#e2ebe4] pr-1.5 mr-1">
            <button
              type="button"
              onClick={() => insertFormatting('## ', '', 'Section Heading')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Heading 2 (## Title)"
            >
              <Heading2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ', '', 'Subsection')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Heading 3 (### Subtitle)"
            >
              <Heading3 size={14} />
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-[#e2ebe4] pr-1.5 mr-1">
            <button
              type="button"
              onClick={() => insertFormatting('- ', '', 'Bullet item')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Bullet List (- item)"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ', '', 'Numbered item')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Numbered List (1. item)"
            >
              <ListOrdered size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('> ', '', 'Important quote or callout')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Blockquote (> quote)"
            >
              <Quote size={14} />
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleInsertLink}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Insert Link [text](url)"
            >
              <LinkIcon size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`', 'code')}
              className="p-1.5 hover:bg-white rounded-lg text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Inline Code (`code`)"
            >
              <Code size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n---\n')}
              className="px-2 py-1 hover:bg-white rounded-lg text-[11px] font-bold text-[#5c6f62] hover:text-[#0f1d14] transition-colors cursor-pointer"
              title="Horizontal Divider"
            >
              Divider
            </button>
          </div>
        </div>

        {/* Body Viewports */}
        {viewMode === 'write' && (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={editorValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 text-sm font-sans leading-relaxed focus:outline-none resize-y bg-transparent"
          />
        )}

        {viewMode === 'preview' && preview}

        {viewMode === 'split' && (
          <div className="grid grid-cols-2 divide-x divide-[#e2ebe4] min-h-[260px]">
            <textarea
              ref={textareaRef}
              rows={rows}
              value={editorValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="p-4 text-sm font-sans leading-relaxed focus:outline-none resize-none bg-transparent"
            />
            <div className="p-4 bg-[#fafcfa] overflow-y-auto max-h-[400px] prose-acf">
              {editorValue.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: renderRichText(editorValue) }} />
              ) : (
                <p className="text-gray-400 italic">No content to preview yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Footer with Word Count */}
        <div className="px-4 py-2 bg-[#f6f9f6] border-t border-[#e2ebe4] flex items-center justify-between text-[11px] text-[#5c6f62]">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{readTimeMinutes} min read</span>
            <span>•</span>
            <span>{value.length} characters</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#175432] font-semibold">
            <span>Markdown supported</span>
            {legacyHtml && (
              <span
                className="text-[#8a9a8f] font-normal"
                title="This record was saved as HTML. It is shown as Markdown for editing and will be saved as Markdown."
              >
                · converted from HTML
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
