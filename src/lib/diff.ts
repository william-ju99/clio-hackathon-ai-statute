/**
 * Simple word-level diff algorithm for displaying inline changes.
 *
 * Produces an array of segments, each marked as "equal", "added", or "removed".
 * This is used to render GitHub-style inline diffs.
 *
 * Typographic variants (e.g. curly vs straight quotes, different semicolon
 * code points) are normalized for comparison so they are treated as equal.
 */

export interface DiffSegment {
  type: "equal" | "added" | "removed";
  value: string;
}

/** Normalize typographic/Unicode variants to a canonical form for diff comparison. */
function normalizeForDiff(s: string): string {
  return s
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // ' ' ‚ ‛ ′ ‵ → '
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // " " „ ‟ ″ ‶ → "
    .replace(/[\u037E\u061B\u204F\u2E35]/g, ";")             // ; ؛ ⁏ ⸵ → ;
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-") // ‐ ‑ ‒ – — ― → -
    .replace(/\u00A0/g, " ");                                 // nbsp → space
}

/**
 * Compute word-level diff between two strings.
 * Uses a longest-common-subsequence approach on word tokens.
 * Typographic variants (curly vs straight quotes, etc.) are treated as equal.
 */
export function computeWordDiff(oldText: string, newText: string): DiffSegment[] {
  if (normalizeForDiff(oldText) === normalizeForDiff(newText)) {
    return [{ type: "equal", value: oldText }];
  }

  if (!oldText) {
    return [{ type: "added", value: newText }];
  }

  if (!newText) {
    return [{ type: "removed", value: oldText }];
  }

  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);
  const oldNorm = oldWords.map(normalizeForDiff);
  const newNorm = newWords.map(normalizeForDiff);

  // Build LCS table (compare normalized forms)
  const m = oldWords.length;
  const n = newWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldNorm[i - 1] === newNorm[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff (emit original strings, compare via normalized)
  const segments: DiffSegment[] = [];
  let i = m;
  let j = n;

  const rawSegments: DiffSegment[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldNorm[i - 1] === newNorm[j - 1]) {
      rawSegments.push({ type: "equal", value: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawSegments.push({ type: "added", value: newWords[j - 1] });
      j--;
    } else {
      rawSegments.push({ type: "removed", value: oldWords[i - 1] });
      i--;
    }
  }

  rawSegments.reverse();

  // Merge consecutive segments of the same type
  for (const seg of rawSegments) {
    const last = segments[segments.length - 1];
    if (last && last.type === seg.type) {
      last.value += seg.value;
    } else {
      segments.push({ ...seg });
    }
  }

  return segments;
}
