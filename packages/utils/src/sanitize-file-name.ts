/**
 * Sanitizes a file name for safe storage and URL usage.
 *
 * - Normalizes accents (é → e, ñ → n)
 * - Replaces spaces with underscores
 * - Removes unsafe URL characters and emojis
 * - Preserves file extension
 * - Falls back to "file" if name becomes empty
 */
export const sanitizeFileName = (name: string) => {
  const extension = name.includes(".") ? (name.split(".").pop() ?? "") : ""
  const baseName = name.replace(`.${extension}`, "")

  const sanitized = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/[_-]+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "")

  return `${sanitized || "file"}${extension ? `.${extension.toLowerCase()}` : ""}`
}
