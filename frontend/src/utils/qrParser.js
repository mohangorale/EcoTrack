/**
 * Extracts a valid EcoTrack Item ID from any QR code payload.
 * Supports:
 * - Direct item ID (e.g. "EW00123", "EW-0004")
 * - Full URL (e.g. "https://ecotrack.app/track/EW00123")
 * - Query string URL (e.g. "https://ecotrack.app/track?id=EW00123")
 * - JSON payload (e.g. {"itemId": "EW00123"})
 */
export function extractItemIdFromQr(rawText) {
  if (!rawText) return '';
  const text = String(rawText).trim();

  // Try JSON
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.itemId) return String(parsed.itemId).trim().toUpperCase();
      if (parsed.id) return String(parsed.id).trim().toUpperCase();
    } catch {
      // not json, continue
    }
  }

  // Check URL path like /track/EW00123 or /track/EW-0004
  const pathMatch = text.match(/\/track\/([A-Za-z0-9_-]+)/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].trim().toUpperCase();
  }

  // Check URL query parameter like ?id=EW00123 or &id=EW00123
  const queryMatch = text.match(/[?&](?:id|itemId)=([A-Za-z0-9_-]+)/i);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1].trim().toUpperCase();
  }

  // Check standard EcoTrack ID patterns like EW00123 or EW-0004
  const ewMatch = text.match(/\b(EW[-_]?[0-9]{3,8})\b/i);
  if (ewMatch && ewMatch[1]) {
    return ewMatch[1].trim().toUpperCase();
  }

  // Fallback: strip URL protocol/domain if present and sanitize
  try {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      const url = new URL(text);
      const segments = url.pathname.split('/').filter(Boolean);
      const last = segments.pop();
      if (last) return last.trim().toUpperCase();
    }
  } catch {
    // Ignore URL parse error
  }

  // Direct alphanumeric string
  return text.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase();
}
