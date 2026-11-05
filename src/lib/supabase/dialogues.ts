import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface DialogueAttachment {
  title: string
  url: string
  size?: number
}

export interface DialogueEventMeta {
  document_url?: string | null
  slides_url?: string | null
  recording_url?: string | null
  attachments?: DialogueAttachment[]
  is_closed?: boolean | null
  dialogue_state?: 'auto' | 'active' | 'closed'
}

export interface DialogueProposal {
  id: string
  title: string
  topic_area: string
  proposer_name: string
  organization: string
  email: string
  phone: string
  proposed_format: string
  preferred_timeframe: string | null
  description: string
  document_url: string | null
  document_name: string | null
  status: 'pending' | 'approved' | 'declined'
  published_event_id: string | null
  admin_notes: string | null
  consent_given: boolean
  created_at: string
  updated_at: string
}

export interface DialogueRegistration {
  id: string
  event_id: string
  event_slug: string
  event_title: string
  participant_name: string
  organization: string
  role_title: string | null
  email: string
  phone: string
  attendance_mode: 'In-Person' | 'Virtual / Online' | 'Either'
  contribution_note: string | null
  status: 'pending' | 'approved' | 'declined'
  admin_notes: string | null
  consent_given: boolean
  created_at: string
  updated_at: string
}

export const DIALOGUE_EVENT_META_KEY = 'dialogue_event_meta'
export const DIALOGUE_PROPOSALS_KEY = 'dialogue_proposals'
export const DIALOGUE_REGISTRATIONS_KEY = 'dialogue_registrations'

/**
 * Extracts and deduplicates all PDF / document attachments on a dialogue event.
 */
export function getDialogueDocuments(event: Record<string, any> | null | undefined): DialogueAttachment[] {
  if (!event) return []
  const docs: DialogueAttachment[] = []
  const seen = new Set<string>()

  const pushDoc = (title: string, url: string | null | undefined, size?: number) => {
    if (!url || typeof url !== 'string' || !url.trim()) return
    const trimmed = url.trim()
    if (seen.has(trimmed)) return
    seen.add(trimmed)
    docs.push({ title: title || 'Policy Dialogue Document (PDF)', url: trimmed, size })
  }

  // 1. Explicit attachments array
  let rawAttachments = event.attachments
  if (typeof rawAttachments === 'string') {
    try {
      rawAttachments = JSON.parse(rawAttachments)
    } catch {
      rawAttachments = []
    }
  }
  if (Array.isArray(rawAttachments)) {
    for (const item of rawAttachments) {
      if (item && typeof item === 'object' && typeof item.url === 'string') {
        pushDoc(item.title || 'Attached PDF Document', item.url, item.size)
      }
    }
  }

  // 2. Primary document_url
  if (event.document_url) {
    pushDoc('Dialogue Concept Note / Brief (PDF)', event.document_url)
  }

  // 3. Slides / Proceedings URL
  if (event.slides_url) {
    pushDoc('Presentation Slides / Proceedings (PDF)', event.slides_url)
  }

  return docs
}

/**
 * Determines whether a policy dialogue should appear in the "Closed Dialogues" tab
 * or the "Active Dialogues" tab.
 */
export function isDialogueClosed(event: Record<string, any> | null | undefined, nowDate: Date = new Date()): boolean {
  if (!event) return false
  if (event.status === 'archived') return true
  if (event.dialogue_state === 'closed') return true
  if (event.dialogue_state === 'active') return false
  if (event.is_closed === true) return true
  if (event.is_closed === false && event.dialogue_state !== 'auto') return false

  const compareIso = event.ends_at || event.starts_at
  if (!compareIso) return false
  const parsed = new Date(compareIso)
  if (Number.isNaN(parsed.getTime())) return false
  return parsed < nowDate
}

/**
 * Merges extra dialogue metadata (PDF attachments, closed state) onto an event record.
 */
export function mergeEventWithDialogueMeta<T extends Record<string, any>>(
  event: T,
  metaMap: Record<string, DialogueEventMeta>
): T {
  if (!event) return event
  const meta = (event.id && metaMap[event.id]) || (event.slug && metaMap[event.slug])
  if (!meta) return event

  return {
    ...event,
    document_url: event.document_url ?? meta.document_url ?? null,
    slides_url: event.slides_url ?? meta.slides_url ?? null,
    recording_url: event.recording_url ?? meta.recording_url ?? null,
    attachments:
      Array.isArray(event.attachments) && event.attachments.length > 0
        ? event.attachments
        : meta.attachments || [],
    is_closed: typeof event.is_closed === 'boolean' ? event.is_closed : (meta.is_closed ?? null),
    dialogue_state:
      event.dialogue_state ||
      meta.dialogue_state ||
      (typeof event.is_closed === 'boolean' ? (event.is_closed ? 'closed' : 'active') : 'auto'),
  }
}

function getSafeAdminOrNull() {
  try {
    return createAdminClient()
  } catch {
    return null
  }
}

export async function getDialogueEventMetaMap(client?: any): Promise<Record<string, DialogueEventMeta>> {
  try {
    const db = client || getSafeAdminOrNull() || (await createClient())
    const fromTable = (name: string) => (db.from as (table: string) => any)(name)
    const { data } = await fromTable('site_settings')
      .select('value')
      .eq('key', DIALOGUE_EVENT_META_KEY)
      .maybeSingle()

    if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
      return data.value as Record<string, DialogueEventMeta>
    }
  } catch {
    // Fallback to empty map
  }
  return {}
}

export async function saveDialogueEventMeta(
  adminClient: any,
  identifiers: { id?: string; slug?: string },
  meta: DialogueEventMeta
) {
  try {
    const current = await getDialogueEventMetaMap(adminClient)
    const updated = { ...current }
    if (identifiers.id) {
      updated[identifiers.id] = { ...(updated[identifiers.id] || {}), ...meta }
    }
    if (identifiers.slug) {
      updated[identifiers.slug] = { ...(updated[identifiers.slug] || {}), ...meta }
    }

    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)
    await fromTable('site_settings').upsert(
      {
        key: DIALOGUE_EVENT_META_KEY,
        value: updated,
        description: 'Metadata for policy dialogue PDF attachments and active/closed state',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
  } catch {
    // Non-fatal fallback
  }
}

export async function fetchDialogueProposals(client?: any): Promise<DialogueProposal[]> {
  const byId = new Map<string, DialogueProposal>()
  const db = client || getSafeAdminOrNull() || (await createClient())
  const fromTable = (name: string) => (db.from as (table: string) => any)(name)

  try {
    const { data } = await fromTable('site_settings')
      .select('value')
      .eq('key', DIALOGUE_PROPOSALS_KEY)
      .maybeSingle()

    if (Array.isArray(data?.value)) {
      for (const item of data.value as DialogueProposal[]) {
        if (item?.id) byId.set(item.id, item)
      }
    }
  } catch {
    // Ignore site_settings read errors
  }

  try {
    const { data, error } = await fromTable('dialogue_proposals')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && Array.isArray(data)) {
      for (const item of data as DialogueProposal[]) {
        if (item?.id) byId.set(item.id, item)
      }
    }
  } catch {
    // Table may not exist yet if migration hasn't been applied
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function insertDialogueProposal(
  input: Omit<DialogueProposal, 'id' | 'created_at' | 'updated_at' | 'status' | 'published_event_id' | 'admin_notes'>
): Promise<DialogueProposal> {
  const now = new Date().toISOString()
  const record: DialogueProposal = {
    id: crypto.randomUUID(),
    ...input,
    status: 'pending',
    published_event_id: null,
    admin_notes: null,
    created_at: now,
    updated_at: now,
  }

  const admin = getSafeAdminOrNull()
  const db = admin || (await createClient())
  const fromTable = (name: string) => (db.from as (table: string) => any)(name)

  try {
    await fromTable('dialogue_proposals').insert(record)
  } catch {
    // Ignore if table not migrated yet
  }

  if (admin) {
    try {
      const existing = await fetchDialogueProposals(admin)
      const next = [record, ...existing.filter((p) => p.id !== record.id)]
      const adminFrom = (name: string) => (admin.from as (table: string) => any)(name)
      await adminFrom('site_settings').upsert(
        {
          key: DIALOGUE_PROPOSALS_KEY,
          value: next,
          description: 'Public proposed policy dialogues',
          updated_at: now,
        },
        { onConflict: 'key' }
      )
    } catch {
      // Ignore fallback write error
    }
  }

  return record
}

export async function updateDialogueProposal(
  id: string,
  updates: Partial<DialogueProposal>
): Promise<DialogueProposal | null> {
  const admin = createAdminClient()
  const fromTable = (name: string) => (admin.from as (table: string) => any)(name)
  const now = new Date().toISOString()

  try {
    await fromTable('dialogue_proposals')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
  } catch {
    // Ignore if table not migrated yet
  }

  const existing = await fetchDialogueProposals(admin)
  let updatedItem: DialogueProposal | null = null
  const next = existing.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates, updated_at: now }
      return updatedItem
    }
    return item
  })

  await fromTable('site_settings').upsert(
    {
      key: DIALOGUE_PROPOSALS_KEY,
      value: next,
      description: 'Public proposed policy dialogues',
      updated_at: now,
    },
    { onConflict: 'key' }
  )

  return updatedItem
}

export async function deleteDialogueProposal(id: string): Promise<void> {
  const admin = createAdminClient()
  const fromTable = (name: string) => (admin.from as (table: string) => any)(name)

  try {
    await fromTable('dialogue_proposals').delete().eq('id', id)
  } catch {
    // Ignore if table not migrated yet
  }

  const existing = await fetchDialogueProposals(admin)
  const next = existing.filter((item) => item.id !== id)
  await fromTable('site_settings').upsert(
    {
      key: DIALOGUE_PROPOSALS_KEY,
      value: next,
      description: 'Public proposed policy dialogues',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  )
}

export async function fetchDialogueRegistrations(client?: any): Promise<DialogueRegistration[]> {
  const byId = new Map<string, DialogueRegistration>()
  const db = client || getSafeAdminOrNull() || (await createClient())
  const fromTable = (name: string) => (db.from as (table: string) => any)(name)

  try {
    const { data } = await fromTable('site_settings')
      .select('value')
      .eq('key', DIALOGUE_REGISTRATIONS_KEY)
      .maybeSingle()

    if (Array.isArray(data?.value)) {
      for (const item of data.value as DialogueRegistration[]) {
        if (item?.id) byId.set(item.id, item)
      }
    }
  } catch {
    // Ignore site_settings read errors
  }

  try {
    const { data, error } = await fromTable('dialogue_registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && Array.isArray(data)) {
      for (const item of data as DialogueRegistration[]) {
        if (item?.id) byId.set(item.id, item)
      }
    }
  } catch {
    // Table may not exist yet if migration hasn't been applied
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function insertDialogueRegistration(
  input: Omit<DialogueRegistration, 'id' | 'created_at' | 'updated_at' | 'status' | 'admin_notes'>
): Promise<DialogueRegistration> {
  const now = new Date().toISOString()
  const record: DialogueRegistration = {
    id: crypto.randomUUID(),
    ...input,
    status: 'pending',
    admin_notes: null,
    created_at: now,
    updated_at: now,
  }

  const admin = getSafeAdminOrNull()
  const db = admin || (await createClient())
  const fromTable = (name: string) => (db.from as (table: string) => any)(name)

  try {
    await fromTable('dialogue_registrations').insert(record)
  } catch {
    // Ignore if table not migrated yet
  }

  if (admin) {
    try {
      const existing = await fetchDialogueRegistrations(admin)
      const next = [record, ...existing.filter((r) => r.id !== record.id)]
      const adminFrom = (name: string) => (admin.from as (table: string) => any)(name)
      await adminFrom('site_settings').upsert(
        {
          key: DIALOGUE_REGISTRATIONS_KEY,
          value: next,
          description: 'Participant requests to join specific policy dialogues',
          updated_at: now,
        },
        { onConflict: 'key' }
      )
    } catch {
      // Ignore fallback write error
    }
  }

  return record
}

export async function updateDialogueRegistration(
  id: string,
  updates: Partial<DialogueRegistration>
): Promise<DialogueRegistration | null> {
  const admin = createAdminClient()
  const fromTable = (name: string) => (admin.from as (table: string) => any)(name)
  const now = new Date().toISOString()

  try {
    await fromTable('dialogue_registrations')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
  } catch {
    // Ignore if table not migrated yet
  }

  const existing = await fetchDialogueRegistrations(admin)
  let updatedItem: DialogueRegistration | null = null
  const next = existing.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates, updated_at: now }
      return updatedItem
    }
    return item
  })

  await fromTable('site_settings').upsert(
    {
      key: DIALOGUE_REGISTRATIONS_KEY,
      value: next,
      description: 'Participant requests to join specific policy dialogues',
      updated_at: now,
    },
    { onConflict: 'key' }
  )

  return updatedItem
}

export async function deleteDialogueRegistration(id: string): Promise<void> {
  const admin = createAdminClient()
  const fromTable = (name: string) => (admin.from as (table: string) => any)(name)

  try {
    await fromTable('dialogue_registrations').delete().eq('id', id)
  } catch {
    // Ignore if table not migrated yet
  }

  const existing = await fetchDialogueRegistrations(admin)
  const next = existing.filter((item) => item.id !== id)
  await fromTable('site_settings').upsert(
    {
      key: DIALOGUE_REGISTRATIONS_KEY,
      value: next,
      description: 'Participant requests to join specific policy dialogues',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  )
}

