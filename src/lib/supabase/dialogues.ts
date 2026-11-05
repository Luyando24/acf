import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  DIALOGUE_EVENT_META_KEY,
  DIALOGUE_PROPOSALS_KEY,
  DIALOGUE_REGISTRATIONS_KEY,
  DialogueEventMeta,
  DialogueProposal,
  DialogueRegistration,
} from '@/types/dialogues'

export * from '@/types/dialogues'

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
