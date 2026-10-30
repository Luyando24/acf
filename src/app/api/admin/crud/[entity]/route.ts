import { NextResponse } from 'next/server'
import { canAccessEntity } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'

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
    itemData.updated_at = new Date().toISOString()

    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)
    const { data, error } = await fromTable(table)
      .upsert(itemData, { onConflict: 'id' })
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
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
    const { data, error } = await fromTable(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
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

    return NextResponse.json({ success: true, id })
  } catch (err) {
    return failure(err, 'Failed to delete entity.')
  }
}
