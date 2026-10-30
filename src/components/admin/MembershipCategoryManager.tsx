'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Shield,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  Check,
  ListPlus,
  FileCheck,
} from 'lucide-react'

export interface MembershipCategoryItem {
  id: string
  name: string
  description: string
  benefits: string[]
  requirements: string[]
  order_index: number
  created_at?: string
  updated_at?: string
}

export const DEFAULT_MEMBERSHIP_CATEGORIES: MembershipCategoryItem[] = [
  {
    id: '99999999-9999-9999-9999-999999999901',
    name: 'Agricultural Producer Associations & Cooperatives',
    description: 'For registered farmer cooperatives, smallholder unions, and commodity associations.',
    benefits: [
      'Direct participation in national policy consultative roundtables',
      'Early access to research publications and market analysis briefs',
      'Representation in multi-stakeholder dialogue working groups',
      'Voting rights in relevant stakeholder advisory caucuses',
    ],
    requirements: [
      'Registered legal cooperative or association in Zambia',
      'Active membership base in the agricultural sector',
      'Commitment to evidence-based agricultural advancement',
    ],
    order_index: 1,
  },
  {
    id: '99999999-9999-9999-9999-999999999902',
    name: 'Agri-Business & Private Sector Enterprises',
    description: 'For input suppliers, commodity traders, food processors, and agricultural finance institutions.',
    benefits: [
      'Engagement with senior policymakers on trade tariffs, subsidies, and regulations',
      'Networking opportunities across the Zambian agricultural ecosystem',
      'Contribution to policy submissions and sector position papers',
      'Listing in the ACF partner directory',
    ],
    requirements: [
      'PACRA-registered business entity operating in Zambia',
      'Demonstrated commercial engagement in agriculture or allied sectors',
      'Adherence to transparent and ethical business practices',
    ],
    order_index: 2,
  },
  {
    id: '99999999-9999-9999-9999-999999999903',
    name: 'Research Institutes & Academic Entities',
    description: 'For universities, research centres, and agricultural think tanks.',
    benefits: [
      'Collaboration on national research agendas and empirical surveys',
      'Platform to disseminate scientific findings to policymakers',
      'Co-hosting of policy symposiums and technical conferences',
    ],
    requirements: [
      'Accredited higher learning or registered research institution',
      'Focus on agricultural economics, agronomy, climate, or rural sociology',
    ],
    order_index: 3,
  },
]

interface CategoryFormData {
  id?: string
  name: string
  description: string
  benefits: string[]
  requirements: string[]
  order_index: number
}

const EMPTY_FORM: CategoryFormData = {
  name: '',
  description: '',
  benefits: [''],
  requirements: [''],
  order_index: 1,
}

export default function MembershipCategoryManager({
  initialCategories,
}: {
  initialCategories: MembershipCategoryItem[]
}) {
  const [categories, setCategories] = useState<MembershipCategoryItem[]>(
    initialCategories.length > 0 ? initialCategories : DEFAULT_MEMBERSHIP_CATEGORIES
  )
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleOpenAdd = () => {
    setEditingCategory({
      ...EMPTY_FORM,
      order_index: categories.length + 1,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: MembershipCategoryItem) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      benefits: Array.isArray(cat.benefits) && cat.benefits.length > 0 ? [...cat.benefits] : [''],
      requirements: Array.isArray(cat.requirements) && cat.requirements.length > 0 ? [...cat.requirements] : [''],
      order_index: cat.order_index ?? 1,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    if (!editingCategory.name.trim()) {
      showNotification('Category name is required.', 'error')
      return
    }

    setIsSubmitting(true)

    const cleanedBenefits = editingCategory.benefits
      .map((b) => b.trim())
      .filter((b) => b.length > 0)

    const cleanedRequirements = editingCategory.requirements
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    const payload = {
      id: editingCategory.id,
      name: editingCategory.name.trim(),
      description: editingCategory.description.trim(),
      benefits: cleanedBenefits,
      requirements: cleanedRequirements,
      order_index: Number(editingCategory.order_index) || 1,
    }

    try {
      if (editingCategory.id) {
        // Update
        const res = await fetch('/api/admin/crud/membership_categories', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to update category.')
        }

        const targetId = editingCategory.id
        setCategories((prev) =>
          prev
            .map((item) => (item.id === targetId ? { ...item, ...payload, id: targetId } : item))
            .sort((a, b) => a.order_index - b.order_index)
        )
        showNotification('Membership category and requirements updated successfully.')
      } else {
        // Create
        const res = await fetch('/api/admin/crud/membership_categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to create category.')
        }

        const newCat: MembershipCategoryItem = data.item || { ...payload, id: crypto.randomUUID() }
        setCategories((prev) => [...prev, newCat].sort((a, b) => a.order_index - b.order_index))
        showNotification('New membership category created successfully.')
      }
      handleCloseModal()
    } catch (err: any) {
      showNotification(err.message || 'Error saving category.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Any associated application will remain intact.')) return

    try {
      const res = await fetch(`/api/admin/crud/membership_categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete category.')
      }
      setCategories((prev) => prev.filter((item) => item.id !== id))
      showNotification('Membership category deleted.')
    } catch (err: any) {
      showNotification(err.message || 'Error deleting category.', 'error')
    }
  }

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const newCategories = [...categories]
    const current = newCategories[index]
    const target = newCategories[targetIndex]

    // Swap order_indexes
    const tempOrder = current.order_index
    current.order_index = target.order_index
    target.order_index = tempOrder

    newCategories[index] = target
    newCategories[targetIndex] = current

    setCategories([...newCategories])

    // Save swapped orders to DB
    try {
      await Promise.all([
        fetch('/api/admin/crud/membership_categories', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: current.id, order_index: current.order_index }),
        }),
        fetch('/api/admin/crud/membership_categories', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: target.id, order_index: target.order_index }),
        }),
      ])
      showNotification('Category display order updated.')
    } catch {
      // optimistic update retained
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2.5 text-sm font-semibold shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-[#1e7e48] border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner & Navigation Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-[#dbe6de] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#122419] tracking-tight">
              Membership Categories & Requirements
            </h1>
            <p className="text-sm text-[#526658] mt-0.5">
              Configure caucus categories, member benefits, and eligibility criteria displayed across the public portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-t border-[#dbe6de] pt-4">
          <Link
            href="/admin/membership"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#526658] hover:text-[#1e7e48] hover:bg-[#f4f8f5] transition-colors"
          >
            Applications List
          </Link>
          <Link
            href="/admin/membership/categories"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#eef6f1] text-[#1e7e48] border border-[#1e7e48]/30 transition-colors"
          >
            Categories & Requirements ({categories.length})
          </Link>
          <Link
            href="/admin/pages/membership"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#526658] hover:text-[#1e7e48] hover:bg-[#f4f8f5] transition-colors"
          >
            Edit Page Intro
          </Link>
        </div>
      </div>

      {/* Category Cards Listing */}
      <div className="space-y-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id || idx}
            className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-8 shadow-xs space-y-6 group hover:border-[#1e7e48]/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#dbe6de] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#eef6f1] text-[#1e7e48] text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-[#122419]">{cat.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#526658] pl-8 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              {/* Order & Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveOrder(idx, 'up')}
                  className="p-2 rounded-lg border border-[#dbe6de] text-[#526658] hover:text-[#1e7e48] hover:bg-[#f4f8f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  onClick={() => handleMoveOrder(idx, 'down')}
                  className="p-2 rounded-lg border border-[#dbe6de] text-[#526658] hover:text-[#1e7e48] hover:bg-[#f4f8f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-2 rounded-lg bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Edit Category"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Benefits & Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Member Benefits */}
              <div className="bg-[#f4f8f5] p-5 rounded-2xl border border-[#dbe6de]/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#1e7e48]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1e7e48]">
                    Member Benefits ({cat.benefits?.length || 0})
                  </h4>
                </div>
                {cat.benefits && cat.benefits.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {cat.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="text-xs text-[#2d3f33] flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e7e48] shrink-0 mt-1.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#526658] italic">No specific benefits listed.</p>
                )}
              </div>

              {/* Eligibility Criteria & Requirements */}
              <div className="bg-[#f4f8f5] p-5 rounded-2xl border border-[#dbe6de]/80 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-[#122419]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#122419]">
                    Eligibility & Requirements ({cat.requirements?.length || 0})
                  </h4>
                </div>
                {cat.requirements && cat.requirements.length > 0 ? (
                  <ul className="space-y-1.5 pl-1">
                    {cat.requirements.map((r, rIdx) => (
                      <li key={rIdx} className="text-xs text-[#526658] flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#526658] shrink-0 mt-1.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#526658] italic">No specific requirements listed.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#dbe6de] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#dbe6de] pb-4">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-[#1e7e48]" />
                <h2 className="text-xl font-bold text-[#122419]">
                  {editingCategory.id ? 'Edit Membership Category' : 'Create New Membership Category'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-[#526658] hover:text-[#122419] hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#122419] mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="e.g. Agri-Business & Private Sector Enterprises"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] text-xs font-bold focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#122419] mb-1.5">
                    Description & Scope
                  </label>
                  <textarea
                    rows={2}
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    placeholder="Brief description of the intended stakeholder caucus or entity profile..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#122419] mb-1.5">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingCategory.order_index}
                    onChange={(e) => setEditingCategory({ ...editingCategory, order_index: Number(e.target.value) || 1 })}
                    className="w-24 px-4 py-2 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                  />
                </div>

                {/* Benefits List Editor */}
                <div className="space-y-2 pt-2 border-t border-[#dbe6de]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1e7e48]">
                      Member Benefits (One bullet per line)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCategory({
                          ...editingCategory,
                          benefits: [...editingCategory.benefits, ''],
                        })
                      }
                      className="text-xs font-bold text-[#1e7e48] hover:underline flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Add Benefit</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingCategory.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => {
                            const newBenefits = [...editingCategory.benefits]
                            newBenefits[bIdx] = e.target.value
                            setEditingCategory({ ...editingCategory, benefits: newBenefits })
                          }}
                          placeholder={`Benefit #${bIdx + 1}`}
                          className="flex-1 px-3 py-2 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBenefits = editingCategory.benefits.filter((_, idx) => idx !== bIdx)
                            setEditingCategory({
                              ...editingCategory,
                              benefits: newBenefits.length > 0 ? newBenefits : [''],
                            })
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements List Editor */}
                <div className="space-y-2 pt-2 border-t border-[#dbe6de]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#122419]">
                      Eligibility Criteria & Requirements (One per line)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCategory({
                          ...editingCategory,
                          requirements: [...editingCategory.requirements, ''],
                        })
                      }
                      className="text-xs font-bold text-[#1e7e48] hover:underline flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Add Requirement</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingCategory.requirements.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={r}
                          onChange={(e) => {
                            const newReqs = [...editingCategory.requirements]
                            newReqs[rIdx] = e.target.value
                            setEditingCategory({ ...editingCategory, requirements: newReqs })
                          }}
                          placeholder={`Requirement #${rIdx + 1}`}
                          className="flex-1 px-3 py-2 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newReqs = editingCategory.requirements.filter((_, idx) => idx !== rIdx)
                            setEditingCategory({
                              ...editingCategory,
                              requirements: newReqs.length > 0 ? newReqs : [''],
                            })
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#dbe6de] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-[#dbe6de] text-xs font-bold text-[#526658] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? 'Saving Category...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
