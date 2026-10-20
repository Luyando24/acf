'use client'

import React, { useState, useRef } from 'react'
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Link as LinkIcon,
  HardDrive,
  Loader2,
  Trash2,
} from 'lucide-react'

interface FileUploadProps {
  label: string
  value: string
  onChange: (url: string, metadata?: { size?: number; name?: string }) => void
  accept?: string
  description?: string
  type?: 'image' | 'document' | 'avatar' | 'logo'
  error?: string
  required?: boolean
  maxSizeMb?: number
}

export default function FileUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  description,
  type = 'image',
  error,
  required = false,
  maxSizeMb = 25,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileProcess = async (file: File) => {
    setUploadError(null)

    // Client-side file size check
    if (file.size > maxSizeMb * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${maxSizeMb}MB.`)
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('kind', type === 'document' ? 'document' : 'image')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload file.')
      }

      onChange(data.url, { size: data.size, name: data.fileName })
      setUploadError(null)
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file from device.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0])
    }
  }

  const handleClear = () => {
    onChange('')
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isDoc = type === 'document' || value.endsWith('.pdf') || value.endsWith('.doc') || value.endsWith('.docx')

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[#0f1d14]">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        <div className="flex items-center gap-1 text-[11px] bg-[#f6f9f6] p-0.5 rounded-lg border border-[#e2ebe4]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#175432] shadow-xs'
                : 'text-[#5c6f62] hover:text-[#0f1d14]'
            }`}
          >
            <HardDrive size={10} />
            <span>Upload Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-[#175432] shadow-xs'
                : 'text-[#5c6f62] hover:text-[#0f1d14]'
            }`}
          >
            <LinkIcon size={10} />
            <span>Asset URL</span>
          </button>
        </div>
      </div>

      {/* Manual URL Input Tab */}
      {activeTab === 'url' ? (
        <div className="space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isDoc ? '/publications/report-2026.pdf' : '/photos/cover.jpg'}
            className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
              error || uploadError
                ? 'border-rose-400 bg-rose-50/30'
                : 'border-[#e2ebe4] bg-white'
            }`}
          />
        </div>
      ) : (
        /* Upload Mode */
        <div className="space-y-2">
          {/* If file is already selected/uploaded */}
          {value ? (
            <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] flex items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-3 min-w-0">
                {isDoc ? (
                  <div className="w-10 h-10 rounded-md bg-red-100 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
                    <FileText size={18} />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md bg-white border border-[#e2ebe4] overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={value}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/photos/logo.png'
                      }}
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#0f1d14] truncate">
                    {value.split('/').pop() || 'Selected file'}
                  </div>
                  <div className="text-[11px] text-[#5c6f62] truncate flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[#175432]">{value}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-[#e2ebe4] rounded-md text-[11px] font-bold text-[#175432] transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Empty Dropzone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#175432] bg-[#f0f6f1]'
                  : error || uploadError
                  ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400'
                  : 'border-[#d0ded3] bg-[#fafcfa] hover:border-[#175432] hover:bg-[#f6f9f6]'
              }`}
            >
              {isUploading ? (
                <div className="py-2 flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#175432]" />
                  <span className="text-sm font-bold text-[#175432]">Uploading from device...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#f0f6f1] text-[#175432] flex items-center justify-center mb-2">
                    {isDoc ? <FileText size={20} /> : <UploadCloud size={20} />}
                  </div>
                  <div className="text-sm font-bold text-[#0f1d14]">
                    Click to browse or drag & drop file from device
                  </div>
                  <div className="text-[11px] text-[#5c6f62] mt-0.5">
                    {description || (isDoc ? `PDF, DOC, DOCX up to ${maxSizeMb}MB` : `PNG, JPG, WebP, or GIF up to ${maxSizeMb}MB`)}
                  </div>
                </>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept={accept}
            className="hidden"
          />
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle size={13} className="shrink-0" />
          <span>{uploadError}</span>
        </p>
      )}

      {/* Prop Validation Error */}
      {error && !uploadError && (
        <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
