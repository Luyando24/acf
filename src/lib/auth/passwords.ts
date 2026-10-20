import { randomBytes } from 'node:crypto'

const SETS = [
  'abcdefghijkmnpqrstuvwxyz',
  'ABCDEFGHJKLMNPQRSTUVWXYZ',
  '23456789',
  '!@#$%^&*',
]

/** Temporary password shown once to the requesting super admin. */
export function generateTempPassword(length = 16): string {
  const all = SETS.join('')
  const pick = (set: string) => set[randomBytes(1)[0] % set.length]
  const chars = SETS.map(pick)
  while (chars.length < length) chars.push(pick(all))
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}
