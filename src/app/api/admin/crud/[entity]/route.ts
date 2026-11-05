import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { canAccessEntity } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getDialogueEventMetaMap,
  mergeEventWithDialogueMeta,
  saveDialogueEventMeta,
} from '@/lib/supabase/dialogues'
import { DEFAULT_OUR_WORK_PAGE_CONTENT, OurWorkPageContent } from '@/types/pageContent'

async function syncProgrammeToOurWorkPage(adminClient: any, savedItem: any) {
  if (!savedItem || !savedItem.slug) return
  try {
    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)
    const { data } = await fromTable('site_settings')
      .select('value')
      .eq('key', 'page_our-work')
      .maybeSingle()

    const current: OurWorkPageContent = {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT,
      ...((data?.value as any) || {}),
    }

    let changed = false

    const updatedThematic = (current.thematic_section?.items || []).map((item) => {
      if (item.slug === savedItem.slug) {
        changed = true
        return {
          ...item,
          title: savedItem.title || item.title,
          summary: savedItem.summary || item.summary,
          body: savedItem.body || item.body,
          icon: savedItem.icon || item.icon,
          cover_image: savedItem.cover_image ?? item.cover_image,
        }
      }
      return item
    })

    const updatedPillars = (current.pillars_section?.pillars || []).map((pillar) => {
      const pillarSlug = pillar.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      if (pillarSlug === savedItem.slug) {
        changed = true
        return {
          ...pillar,
          title: savedItem.title || pillar.title,
          description: savedItem.summary || pillar.description,
          icon: savedItem.icon || pillar.icon,
        }
      }
      return pillar
    })

    const updatedProjects = (current.projects_section?.projects || []).map((proj) => {
      if (proj.slug === savedItem.slug) {
        changed = true
        return {
          ...proj,
          title: savedItem.title || proj.title,
          description: savedItem.summary || proj.description,
          icon: savedItem.icon || proj.icon,
        }
      }
      return proj
    })

    if (changed) {
      await fromTable('site_settings').upsert(
        {
          key: 'page_our-work',
          value: {
            ...current,
            thematic_section: { ...current.thematic_section, items: updatedThematic },
            pillars_section: { ...current.pillars_section, pillars: updatedPillars },
            projects_section: { ...current.projects_section, projects: updatedProjects },
          },
          description: 'Editable page content for our-work page',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
    }
  } catch {
    // Non-fatal sync error
  }
}

const TABLE_MAP: Record<string, string> = {
  publications: 'publications',
  news: 'news_posts',
  news_posts: 'news_posts',
  events: 'events',
  opportunities: 'opportunities',
  programmes: 'programmes',
  people: 'people',
  partners: 'partners',
  membership: 'membership_applications',
  membership_applications: 'membership_applications',
  membership_categories: 'membership_categories',
  contacts: 'contact_messages',
  contact_messages: 'contact_messages',
  newsletter: 'newsletter_subscribers',
  newsletter_subscribers: 'newsletter_subscribers',
}

const TABLES_WITHOUT_UPDATED_AT = new Set([
  'membership_applications',
  'contact_messages',
  'newsletter_subscribers',
  'publication_categories',
])

function failure(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback
  if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    return NextResponse.json({ error: 'Staff data store is not configured.' }, { status: 503 })
  }
  return NextResponse.json({ error: message || fallback }, { status: 500 })
}

async function authorize(entity: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE') {
  const auth = await requireStaff()
  if (!auth.ok) return { response: auth.response }
  const session = auth.session
  if (!canAccessEntity(session.role, entity, method)) {
    return {
      response: NextResponse.json(
        { error: 'You do not have permission for this action.' },
        { status: 403 }
      ),
    }
  }
  return { response: null }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params
    const denied = await authorize(entity.toLowerCase(), 'GET')
    if (denied.response) return denied.response

    const table = TABLE_MAP[entity.toLowerCase()]

    if (!table) {
      return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)
    let query = fromTable(table).select('*')

    if (table === 'publications') {
      query = fromTable(table).select('*, publication_categories(name)').order('published_on', { ascending: false })
    } else if (table === 'membership_applications') {
      query = fromTable(table).select('*, membership_categories(name)').order('created_at', { ascending: false })
    } else if (table === 'people' || table === 'partners' || table === 'programmes' || table === 'membership_categories') {
      query = fromTable(table).select('*').order('order_index', { ascending: true })
    } else if (table === 'events') {
      query = fromTable(table).select('*').order('starts_at', { ascending: false })
    } else if (table === 'opportunities') {
      query = fromTable(table).select('*').order('closes_on', { ascending: false })
    } else {
      query = fromTable(table).select('*').order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (table === 'events' && Array.isArray(data)) {
      const metaMap = await getDialogueEventMetaMap(adminClient)
      return NextResponse.json({
        success: true,
        data: data.map((ev) => mergeEventWithDialogueMeta(ev, metaMap)),
      })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (err) {
    return failure(err, 'Server error')
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params
    const denied = await authorize(entity.toLowerCase(), 'POST')
    if (denied.response) return denied.response

    const table = TABLE_MAP[entity.toLowerCase()]

    if (!table) {
      return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 400 })
    }

    const payload = await request.json()
    const adminClient = createAdminClient()

    // Ensure valid UUID if not set or clean
    const itemData = { ...payload }
    if (!itemData.id) {
      itemData.id = crypto.randomUUID()
    }
    if (!TABLES_WITHOUT_UPDATED_AT.has(table)) {
      itemData.updated_at = new Date().toISOString()
    } else {
      delete itemData.updated_at
    }

    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)

    if (table === 'events') {
      const {
        document_url,
        slides_url,
        recording_url,
        attachments,
        is_closed,
        dialogue_state,
        ...baseEventData
      } = itemData

      await saveDialogueEventMeta(
        adminClient,
        { id: itemData.id, slug: itemData.slug },
        {
          document_url: document_url ?? null,
          slides_url: slides_url ?? null,
          recording_url: recording_url ?? null,
          attachments: Array.isArray(attachments) ? attachments : [],
          is_closed: typeof is_closed === 'boolean' ? is_closed : null,
          dialogue_state: dialogue_state || 'auto',
        }
      )

      let { data, error } = await fromTable(table)
        .upsert(
          {
            ...baseEventData,
            document_url: document_url ?? null,
            slides_url: slides_url ?? null,
            recording_url: recording_url ?? null,
            attachments: Array.isArray(attachments) ? attachments : [],
            is_closed: typeof is_closed === 'boolean' ? is_closed : false,
          },
          { onConflict: 'id' }
        )
        .select()

      if (error) {
        const retry = await fromTable(table)
          .upsert(baseEventData, { onConflict: 'id' })
          .select()
        data = retry.data
        error = retry.error
      }

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      revalidatePath('/events')
      if (itemData.slug) revalidatePath(`/events/${itemData.slug}`)
      const metaMap = await getDialogueEventMetaMap(adminClient)
      return NextResponse.json({
        success: true,
        item: mergeEventWithDialogueMeta(data?.[0] || itemData, metaMap),
      })
    }

    let { data, error } = await fromTable(table)
      .upsert(itemData, { onConflict: 'id' })
      .select()

    if (error && error.message?.includes('updated_at')) {
      const { updated_at: _ignored, ...withoutUpdatedAt } = itemData
      const retry = await fromTable(table)
        .upsert(withoutUpdatedAt, { onConflict: 'id' })
        .select()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    if (table === 'programmes') {
      await syncProgrammeToOurWorkPage(adminClient, data?.[0] || itemData)
      revalidatePath('/our-work')
      revalidatePath('/')
    }

    return NextResponse.json({ success: true, item: data?.[0] || itemData })
  } catch (err) {
    return failure(err, 'Failed to save entity.')
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params
    const denied = await authorize(entity.toLowerCase(), 'PATCH')
    if (denied.response) return denied.response

    const table = TABLE_MAP[entity.toLowerCase()]

    if (!table) {
      return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 400 })
    }

    const payload = await request.json()
    const { id, ...updates } = payload

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required for update.' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)

    if (table === 'events') {
      const {
        document_url,
        slides_url,
        recording_url,
        attachments,
        is_closed,
        dialogue_state,
        ...baseUpdates
      } = updates

      await saveDialogueEventMeta(
        adminClient,
        { id, slug: updates.slug },
        {
          ...(document_url !== undefined ? { document_url } : {}),
          ...(slides_url !== undefined ? { slides_url } : {}),
          ...(recording_url !== undefined ? { recording_url } : {}),
          ...(attachments !== undefined ? { attachments } : {}),
          ...(is_closed !== undefined ? { is_closed } : {}),
          ...(dialogue_state !== undefined ? { dialogue_state } : {}),
        }
      )

      let data: any = null
      let error: any = null

      if (Object.keys(baseUpdates).length > 0 || is_closed !== undefined || document_url !== undefined) {
        const dbUpdates = { ...updates }
        delete dbUpdates.dialogue_state
        const res = await fromTable(table)
          .update({ ...dbUpdates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
        data = res.data
        error = res.error

        if (error && Object.keys(baseUpdates).length > 0) {
          const retry = await fromTable(table)
            .update({ ...baseUpdates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
          data = retry.data
          error = retry.error
        } else if (error) {
          error = null
        }
      }

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      revalidatePath('/events')
      const metaMap = await getDialogueEventMetaMap(adminClient)
      return NextResponse.json({
        success: true,
        item: mergeEventWithDialogueMeta(data?.[0] || payload, metaMap),
      })
    }

    const updatePayload: Record<string, any> = { ...updates }
    if (!TABLES_WITHOUT_UPDATED_AT.has(table)) {
      updatePayload.updated_at = new Date().toISOString()
    } else {
      delete updatePayload.updated_at
    }

    if (table === 'membership_applications') {
      const {
        status,
        notes,
        applicant_type,
        org_name,
        contact_name,
        email,
        phone,
        location_province,
        sector_interest,
        created_at,
      } = updatePayload

      const membershipUpdates: Record<string, any> = {}
      if (status !== undefined) membershipUpdates.status = status
      if (notes !== undefined) membershipUpdates.notes = notes

      let { data, error } = await fromTable(table)
        .update(membershipUpdates)
        .eq('id', id)
        .select()

      if (!error && (!data || data.length === 0) && contact_name && email && phone) {
        const upsertRes = await fromTable(table)
          .upsert(
            {
              id,
              applicant_type: applicant_type || 'organisation',
              org_name: org_name ?? null,
              contact_name,
              email,
              phone,
              location_province: location_province ?? null,
              sector_interest: sector_interest ?? null,
              consent_given: true,
              status: status || 'new',
              notes: notes ?? null,
              ...(created_at ? { created_at } : {}),
            },
            { onConflict: 'id' }
          )
          .select()
        data = upsertRes.data
        error = upsertRes.error
      }

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      revalidatePath('/admin/membership')
      revalidatePath(`/admin/membership/${id}`)
      return NextResponse.json({ success: true, item: data?.[0] || payload })
    }

    let { data, error } = await fromTable(table)
      .update(updatePayload)
      .eq('id', id)
      .select()

    if (error && error.message?.includes('updated_at')) {
      const { updated_at: _ignored, ...withoutUpdatedAt } = updatePayload
      const retry = await fromTable(table)
        .update(withoutUpdatedAt)
        .eq('id', id)
        .select()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    if (table === 'programmes') {
      await syncProgrammeToOurWorkPage(adminClient, data?.[0] || payload)
      revalidatePath('/our-work')
      revalidatePath('/')
    }

    return NextResponse.json({ success: true, item: data?.[0] || payload })
  } catch (err) {
    return failure(err, 'Failed to update entity.')
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params
    const denied = await authorize(entity.toLowerCase(), 'DELETE')
    if (denied.response) return denied.response

    const table = TABLE_MAP[entity.toLowerCase()]

    if (!table) {
      return NextResponse.json({ error: `Unknown entity: ${entity}` }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')
    if (!id) {
      const body = await request.json().catch(() => ({}))
      id = body.id
    }

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required for deletion.' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)
    const { error } = await fromTable(table).delete().eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    if (table === 'programmes') {
      revalidatePath('/our-work')
      revalidatePath('/')
    }

    return NextResponse.json({ success: true, id })
  } catch (err) {
    return failure(err, 'Failed to delete entity.')
  }
}
