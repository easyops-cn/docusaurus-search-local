/**
 * Escape html special chars.
 *
 * @param unsafe - A unsafe string.
 *
 * @returns A safe string can be injected as innerHTML.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
