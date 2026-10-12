/**
 * ACF Zambian Locale Formatters
 * Timezone: Africa/Lusaka (CAT, UTC+2)
 * Date format: DD Month YYYY
 */

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return ''
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    if (isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Lusaka',
    }).format(date)
  } catch {
    return String(dateString)
  }
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return ''
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    if (isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Lusaka',
    }).format(date) + ' CAT'
  } catch {
    return String(dateString)
  }
}

export function formatCurrencyZMW(amount: number): string {
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Check if an opportunity closing date is in the past in Africa/Lusaka timezone
 */
export function isOpportunityClosed(closesOnDate: string): boolean {
  if (!closesOnDate) return false
  const now = new Date()
  const closing = new Date(`${closesOnDate}T23:59:59+02:00`)
  return now > closing
}
