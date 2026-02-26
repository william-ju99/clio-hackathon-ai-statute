/**
 * API client for the statute parser backend running on localhost:8000.
 */

const API_BASE = "http://localhost:8000";

// ---------------------------------------------------------------------------
// Types — matches the FastAPI ProcessResponse schema
// ---------------------------------------------------------------------------

export interface ProcessResponse {
  billNumber: string;
  sessionLawPdfBase64: string;
  originalStatuteText: string;
  updatedStatuteText: string;
  analysis: string;
}

// ---------------------------------------------------------------------------
// Client-side cache (survives navigations within the same session)
// ---------------------------------------------------------------------------

const cache = new Map<string, ProcessResponse>();

function cacheKey(billNumber: string): string {
  return billNumber.trim().toUpperCase();
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * Call the backend to process a bill.
 * POST /api/process  { billNumber: string }
 *
 * Results are cached in-memory so repeat visits to the same bill are instant.
 */
export async function processBill(
  billNumber: string
): Promise<ProcessResponse> {
  const key = cacheKey(billNumber);

  const cached = cache.get(key);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/api/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ billNumber }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? res.statusText;
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  const data: ProcessResponse = await res.json();
  cache.set(key, data);
  return data;
}

/** Clear a single entry (or the entire cache if no key is given). */
export function clearCache(billNumber?: string): void {
  if (billNumber) {
    cache.delete(cacheKey(billNumber));
  } else {
    cache.clear();
  }
}

/**
 * Convert a base64 encoded PDF to a blob URL that can be used in an iframe.
 */
export function base64PdfToUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}
