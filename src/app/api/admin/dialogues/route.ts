import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { canAccessEntity } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  deleteDialogueProposal,
  deleteDialogueRegistration,
  fetchDialogueProposals,
  fetchDialogueRegistrations,
  saveDialogueEventMeta,
  updateDialogueProposal,
  updateDialogueRegistration,
} from '@/lib/supabase/dialogues'
import { sendEmail } from '@/lib/email/mailer'
import { escapeHtml } from '@/lib/content/richText'

export async function GET() {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    if (!canAccessEntity(auth.session.role, 'events', 'GET')) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const admin = createAdminClient()
    const [proposals, registrations] = await Promise.all([
      fetchDialogueProposals(admin),
      fetchDialogueRegistrations(admin),
    ])

    return NextResponse.json({
      success: true,
      proposals,
      registrations,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    if (!canAccessEntity(auth.session.role, 'events', 'PATCH')) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const body = await request.json()
    const { kind, id, status, admin_notes } = body

    if (!id || !kind || !['proposal', 'registration'].includes(kind)) {
      return NextResponse.json({ error: 'Valid kind and record id are required.' }, { status: 400 })
    }

    if (status && !['pending', 'approved', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 })
    }

    if (kind === 'registration') {
      const updated = await updateDialogueRegistration(id, {
        ...(status ? { status } : {}),
        ...(admin_notes !== undefined ? { admin_notes } : {}),
      })

      if (updated && (status === 'approved' || status === 'declined')) {
        try {
          await sendEmail({
            to: [updated.email],
            subject: `[ACF Policy Dialogue] Registration ${status === 'approved' ? 'Approved' : 'Update'}: ${updated.event_title}`,
            html:
              status === 'approved'
                ? `
                  <h2>Your Dialogue Participation Request Has Been Approved</h2>
                  <p>Dear ${escapeHtml(updated.participant_name)},</p>
                  <p>The Agricultural Consultative Forum (ACF) Secretariat has <strong>approved</strong> your request to join the policy dialogue:</p>
                  <p><strong>${escapeHtml(updated.event_title)}</strong> (${escapeHtml(updated.attendance_mode)})</p>
                  ${admin_notes ? `<p><strong>Secretariat Note:</strong> ${escapeHtml(admin_notes)}</p>` : ''}
                  <p>You can view the dialogue details and any attached briefing documents at <a href="https://acfzambia.org/events/${escapeHtml(updated.event_slug)}">acfzambia.org/events/${escapeHtml(updated.event_slug)}</a>.</p>
                `
                : `
                  <h2>Update on Your Dialogue Participation Request</h2>
                  <p>Dear ${escapeHtml(updated.participant_name)},</p>
                  <p>Thank you for your interest in joining <strong>${escapeHtml(updated.event_title)}</strong>. Due to capacity or constituency balance for this session, we are unable to confirm your registration at this time.</p>
                  ${admin_notes ? `<p><strong>Secretariat Note:</strong> ${escapeHtml(admin_notes)}</p>` : ''}
                `,
          })
        } catch {
          // Non-fatal email error
        }
      }

      revalidatePath('/events')
      if (updated?.event_slug) revalidatePath(`/events/${updated.event_slug}`)

      return NextResponse.json({ success: true, item: updated })
    }

    const updatedProposal = await updateDialogueProposal(id, {
      ...(status ? { status } : {}),
      ...(admin_notes !== undefined ? { admin_notes } : {}),
    })

    revalidatePath('/events')
    return NextResponse.json({ success: true, item: updatedProposal })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update record.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    if (!canAccessEntity(auth.session.role, 'events', 'POST')) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const body = await request.json()
    const { action, proposalId, starts_at, venue } = body

    if (action !== 'publish_proposal' || !proposalId) {
      return NextResponse.json({ error: 'Invalid action or missing proposalId.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const proposals = await fetchDialogueProposals(admin)
    const proposal = proposals.find((p) => p.id === proposalId)

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 })
    }

    const eventId = crypto.randomUUID()
    const baseSlug = proposal.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const slug = `${baseSlug}-${eventId.slice(0, 6)}`

    // Default start date: 14 days from now at 09:00 CAT if not provided
    const defaultStart = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    defaultStart.setUTCHours(7, 0, 0, 0)
    const startIso = starts_at || defaultStart.toISOString()

    const defaultEnd = new Date(new Date(startIso).getTime() + 6 * 60 * 60 * 1000).toISOString()

    const attachments = proposal.document_url
      ? [
          {
            title: proposal.document_name || 'Proposed Concept Note (PDF)',
            url: proposal.document_url,
          },
        ]
      : []

    const baseEventPayload = {
      id: eventId,
      slug,
      title: proposal.title,
      description: `${proposal.description}\n\nThematic Pillar: ${proposal.topic_area} | Proposed by: ${proposal.organization || proposal.proposer_name}`,
      starts_at: startIso,
      ends_at: defaultEnd,
      venue: venue || `${proposal.proposed_format} (Lusaka & Virtual)`,
      virtual_url: null,
      registration_url: `/events/${slug}#join-dialogue`,
      featured_image: '/photos/dialogue.jpg',
      status: 'published',
      updated_at: new Date().toISOString(),
    }

    await saveDialogueEventMeta(
      admin,
      { id: eventId, slug },
      {
        document_url: proposal.document_url || null,
        attachments,
        is_closed: false,
        dialogue_state: 'active',
      }
    )

    const fromTable = (name: string) => (admin.from as (table: string) => any)(name)
    let { data: createdEvent, error: createError } = await fromTable('events')
      .upsert(
        {
          ...baseEventPayload,
          document_url: proposal.document_url || null,
          attachments,
          is_closed: false,
        },
        { onConflict: 'id' }
      )
      .select()

    if (createError) {
      const retry = await fromTable('events')
        .upsert(baseEventPayload, { onConflict: 'id' })
        .select()
      createdEvent = retry.data
      createError = retry.error
    }

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    const updatedProposal = await updateDialogueProposal(proposalId, {
      status: 'approved',
      published_event_id: eventId,
    })

    try {
      await sendEmail({
        to: [proposal.email],
        subject: `[ACF Policy Dialogue Approved & Scheduled] ${proposal.title}`,
        html: `
          <h2>Your Proposed Policy Dialogue Has Been Approved</h2>
          <p>Dear ${escapeHtml(proposal.proposer_name)},</p>
          <p>We are pleased to inform you that your proposed policy dialogue <strong>&ldquo;${escapeHtml(proposal.title)}&rdquo;</strong> has been approved and published by the ACF Secretariat.</p>
          <p>View the active dialogue page at <a href="https://acfzambia.org/events/${escapeHtml(slug)}">acfzambia.org/events/${escapeHtml(slug)}</a>.</p>
        `,
      })
    } catch {
      // Non-fatal email error
    }

    revalidatePath('/events')
    revalidatePath(`/events/${slug}`)

    return NextResponse.json({
      success: true,
      proposal: updatedProposal,
      event: {
        ...(createdEvent?.[0] || baseEventPayload),
        document_url: proposal.document_url || null,
        attachments,
        is_closed: false,
        dialogue_state: 'active',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to publish proposed dialogue.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    if (!canAccessEntity(auth.session.role, 'events', 'DELETE')) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const kind = searchParams.get('kind')
    const id = searchParams.get('id')

    if (!id || !kind || !['proposal', 'registration'].includes(kind)) {
      return NextResponse.json({ error: 'Valid kind and id are required.' }, { status: 400 })
    }

    if (kind === 'registration') {
      await deleteDialogueRegistration(id)
    } else {
      await deleteDialogueProposal(id)
    }

    revalidatePath('/events')
    return NextResponse.json({ success: true, id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete record.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

