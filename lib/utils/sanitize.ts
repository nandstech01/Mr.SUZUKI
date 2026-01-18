/**
 * Sanitize user input for Supabase ilike queries
 * Escapes special characters: %, _, \
 */
export function sanitizeForIlike(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

/**
 * Validate and sanitize a search query
 * Returns null if input is invalid
 */
export function sanitizeSearchQuery(input: string | null, maxLength = 100): string | null {
  if (!input) return null

  const trimmed = input.trim()
  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null
  }

  return sanitizeForIlike(trimmed)
}
