/**
 *
 * Extracts the initials from a name (max 2 letters).
 *
 * - Trims whitespace
 * - Returns first + last initial for multi-word names
 * - Falls back to "X" if no initials are found
 */
export const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((n) => n.length > 0)

  if (parts.length === 0) return "X"
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() ?? "X"

  const first = parts[0]?.[0]?.toUpperCase() ?? "X"
  const last = parts[parts.length - 1]?.[0]?.toUpperCase() ?? "X"

  return first + last
}
