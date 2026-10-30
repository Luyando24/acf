'use client'

import React, { useState } from 'react'
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  Send,
  Paperclip,
  Check,
} from 'lucide-react'

interface OpportunityApplicationFormProps {
  opportunityId: string
  opportunityTitle: string
  opportunityType: string
  acceptedDocuments?: string[]
}

export default function OpportunityApplicationForm({
  opportunityId,
  opportunityTitle,
  opportunityType,
  acceptedDocuments = ['Curriculum Vitae (CV)', 'Cover Letter', 'Professional Qualifications'],
}: OpportunityApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    notes: '',
  })

  // Track uploaded files per document requirement: { [documentName]: File }
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const docList =
    acceptedDocuments && acceptedDocuments.length > 0
      ? acceptedDocuments
      : ['Curriculum Vitae (CV)', 'Cover Letter', 'Relevant Qualifications']

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Max 15MB limit check
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds the maximum allowed size of 15MB.`)
        return
      }
      setErrorMsg('')
      setUploadedFiles((prev) => ({
        ...prev,
        [docName]: file,
      }))
    }
  }

  const handleRemoveFile = (docName: string) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev }
      delete copy[docName]
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Please complete all required contact fields.')
      return
    }

    // Check if at least primary document (e.g. CV) is uploaded
    const uploadedCount = Object.keys(uploadedFiles).length
    if (uploadedCount === 0) {
      setErrorMsg('Please attach at least one required document (e.g. your CV) to submit your application.')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate submission latency
      await new Promise((resolve) => setTimeout(resolve, 900))
      setIsSubmitted(true)
    } catch (err: any) {
      setErrorMsg('Failed to process your application submission. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-[#f0f9f3] rounded-3xl border border-[#bbf7d0] p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#1e7e48] text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl font-black text-[#122419]">
          Application Received Successfully!
        </h3>
        <p className="text-sm text-[#2d3f33] max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="font-bold">{formData.fullName}</strong>. Your application and{' '}
          <strong className="font-bold">{Object.keys(uploadedFiles).length} uploaded documents</strong> for{' '}
          <em>&ldquo;{opportunityTitle}&rdquo;</em> have been registered with the ACF Recruitment and Procurement Secretariat.
        </p>
        <div className="p-4 rounded-2xl bg-white border border-[#d1e7dd] text-xs text-[#1e7e48] max-w-md mx-auto space-y-1">
          <p className="font-bold">Confirmation Reference: ACF-APP-{opportunityId.slice(0, 6).toUpperCase()}</p>
          <p className="text-[#526658]">A confirmation receipt has been sent to {formData.email}.</p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false)
              setUploadedFiles({})
              setFormData({ fullName: '', email: '', phone: '', organization: '', notes: '' })
            }}
            className="text-xs font-bold text-[#1e7e48] hover:underline"
          >
            Submit another application or document
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-10 shadow-xs space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Paperclip size={18} className="text-[#1e7e48]" />
          <h3 className="text-xl font-bold text-[#122419]">
            Submit Application & Document Uploads
          </h3>
        </div>
        <p className="text-xs text-[#526658] leading-relaxed">
          Please provide your applicant particulars and attach the required verification documents requested by the ACF Secretariat for this {opportunityType.toLowerCase()}.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Particulars */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e7e48]">
            1. Applicant Particulars
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
                Full Name / Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Dr. Kondwani Phiri"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. kphiri@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
                Telephone / Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +260 97 1234567"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
                Current Affiliation / Entity (Optional)
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Independent Consultant / University of Zambia"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Accepted Documents Upload Area */}
        <div className="space-y-4 pt-4 border-t border-[#dbe6de]">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e7e48]">
              2. Required Document Attachments ({docList.length})
            </h4>
            <span className="text-[11px] text-[#526658]">
              Accepted formats: PDF, DOC, DOCX (Max 15MB each)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docList.map((docName, idx) => {
              const uploaded = uploadedFiles[docName]
              const inputId = `doc-upload-${idx}`

              return (
                <div
                  key={docName}
                  className={`rounded-2xl border p-4 transition-all ${
                    uploaded
                      ? 'border-[#86efac] bg-[#f0fdf4]'
                      : 'border-[#dbe6de] bg-[#fafcfa] hover:border-[#1e7e48]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={16}
                        className={uploaded ? 'text-[#16a34a]' : 'text-[#1e7e48]'}
                      />
                      <span className="text-xs font-bold text-[#122419]">{docName}</span>
                    </div>
                    {uploaded && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#166534]">
                        <Check size={11} /> Ready
                      </span>
                    )}
                  </div>

                  {uploaded ? (
                    <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-[#bbf7d0] text-xs">
                      <span className="truncate font-semibold text-[#166534]">
                        {uploaded.name} ({(uploaded.size / 1024).toFixed(0)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(docName)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor={inputId}
                        className="w-full py-2.5 px-3 border border-dashed border-[#ccd9cf] hover:border-[#1e7e48] rounded-xl flex items-center justify-center gap-2 text-xs text-[#526658] hover:text-[#1e7e48] bg-white cursor-pointer transition-colors"
                      >
                        <UploadCloud size={14} />
                        <span>Select or Drag File</span>
                      </label>
                      <input
                        id={inputId}
                        type="file"
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={(e) => handleFileChange(docName, e)}
                        className="sr-only"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Notes / Brief Statement */}
        <div className="space-y-2 pt-4 border-t border-[#dbe6de]">
          <label className="block text-xs font-bold text-[#2d3f33]">
            3. Additional Notes or Motivation (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Summarize your qualifications or any specific details concerning your application..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white resize-y"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#526658]">
            By submitting, you certify that all information and attached credentials are true and verifiable.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSubmitting ? (
              <span>Uploading & Processing...</span>
            ) : (
              <>
                <Send size={14} />
                <span>Submit Application & Documents</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
