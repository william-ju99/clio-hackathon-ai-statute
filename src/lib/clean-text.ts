/**
 * Normalise a raw statute dump into clean, consistently-formatted text.
 *
 * Both the PDF-extracted original and the AI-generated update must end up
 * with the **same paragraph structure** so the diff algorithm can align them.
 *
 * Algorithm:
 *  1. Strip vLex boilerplate (headers, footers, metadata, citation lines).
 *  2. Join everything into one big string (unwrap all hard line-breaks).
 *  3. Re-split into paragraphs by inserting breaks before subsection markers
 *     like (1), (1.3), (a), (b) and structural markers like History:.
 *  4. Normalise whitespace within each paragraph.
 *  5. Return paragraphs separated by double newlines.
 */

// ---- helpers ---------------------------------------------------------------

/** Lines whose trimmed content starts with any of these are stripped. */
const BOILERPLATE_STARTS = [
  "Downloaded from vLex",
  "© Copyright",
  "Copy for use in the context",
  "Otherwise, distribution",
  "Library:",
  "Edition:",
  "Currency:",
  "Citation:",
  "Year:",
  "vLex Document Id:",
  "Link:",
  "C.R.S. §", // citation / title line (not part of statute body)
];

/** Page-header date lines like "February 25, 2026 21:39 1/4" */
const PAGE_HEADER_RE =
  /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}\s+\d+\/\d+$/;

function isBoilerplate(trimmed: string): boolean {
  if (BOILERPLATE_STARTS.some((prefix) => trimmed.startsWith(prefix)))
    return true;
  if (PAGE_HEADER_RE.test(trimmed)) return true;
  return false;
}

// ---- main export -----------------------------------------------------------

export function cleanStatuteText(raw: string): string {
  // Step 1 – strip boilerplate lines
  const lines = raw.split("\n");
  const kept: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (isBoilerplate(t)) continue;
    kept.push(t);
  }

  // Step 2 – collapse everything into one string (unwraps PDF hard-wraps)
  let text = kept.join(" ").replace(/\s+/g, " ").trim();

  // Step 2b – normalise common PDF-vs-AI formatting discrepancies
  //   • Ensure a space before § (PDF often produces "447,§" instead of "447, §")
  //   • Normalise §§ spacing too
  text = text.replace(/,§/g, ", §");
  text = text.replace(/(\S)§/g, "$1 §");
  //   • Normalise dash variants (em/en dash → hyphen in bill references)
  text = text.replace(/[–—]/g, "-");
  //   • Remove stray spaces around hyphens in bill references like "HB 10 -1422"
  text = text.replace(/(\w)\s+-\s*(\d)/g, "$1-$2");
  text = text.replace(/(\w)-\s+(\d)/g, "$1-$2");

  // Step 3 – insert paragraph breaks before subsection / sub-item markers.
  //
  //   Numbered subsections  (1), (1.3), (10.5)  — only when preceded by
  //   sentence-ending punctuation (. : ;) to avoid splitting references
  //   like "section 26-11.5-103 (2)".
  //
  //   Lettered sub-items  (a), (b), (c)  — more aggressively because they
  //   almost always start a new logical item in Colorado statutes.
  //
  //   Structural markers  History:, Cross Reference:, Note:

  // Numbered: split when preceded by . : ;
  text = text.replace(/([.:;])\s+(?=\(\d[\d.]*\)\s)/g, "$1\n\n");

  // Lettered: split whenever preceded by whitespace (these are almost never
  // used as inline references — they are sub-item markers)
  text = text.replace(/\s+(?=\([a-z]\)\s)/gi, "\n\n");

  // Structural markers
  text = text.replace(/([.:;])\s+(?=(?:History|Cross Reference|Note):)/g, "$1\n\n");

  // Step 4 – normalise and return
  return text
    .split(/\n\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}
