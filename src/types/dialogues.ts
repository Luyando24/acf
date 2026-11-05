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

