import type { UserRole } from '@/types/database.types'

export const STAFF_ROLES = [
  'super_admin',
  'admin',
  'editor',
  'contributor',
  'viewer',
] as const satisfies readonly UserRole[]

const SUBMISSION_ENTITIES = new Set([
  'membership',
  'membership_applications',
  'contacts',
  'contact_messages',
  'newsletter',
  'newsletter_subscribers',
])

export function isStaffRole(role: string | null | undefined): role is UserRole {
  return STAFF_ROLES.includes(role as UserRole)
}

/** Keep post-login redirects inside the admin area. */
export function safeAdminRedirect(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/admin'
  }
  if (value.includes('://') || value.includes('\\')) return '/admin'
  if (!value.startsWith('/admin') || value.startsWith('/admin/login')) return '/admin'
  return value
}

/**
 * Server-side role gate for the generic admin CRUD route.
 * Viewers can read. Contributors can create and edit content, not submissions.
 * Editors can also delete content. Admins can manage submissions. Settings stay with super admins.
 */
export function canAccessEntity(
  role: UserRole,
  entity: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
): boolean {
  if (role === 'super_admin') return true

  const submission = SUBMISSION_ENTITIES.has(entity)

  if (method === 'GET') {
    if (submission) return role === 'admin' || role === 'viewer'
    return role === 'admin' || role === 'editor' || role === 'contributor' || role === 'viewer'
  }

  if (role === 'viewer') return false
  if (submission) return role === 'admin'
  if (method === 'DELETE') return role === 'admin' || role === 'editor'
  return role === 'admin' || role === 'editor' || role === 'contributor'
}

export function canManageSettings(role: UserRole): boolean {
  return role === 'super_admin'
}

export function canEditPages(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'editor'
}

export function canUpload(role: UserRole): boolean {
  return role !== 'viewer'
}

export function canExportSubmissions(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin'
}
