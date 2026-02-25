/**
 * Simple word-level diff algorithm for displaying inline changes.
 *
 * Produces an array of segments, each marked as "equal", "added", or "removed".
 * This is used to render GitHub-style inline diffs.
 */

export interface DiffSegment {
  type: "equal" | "added" | "removed";
  value: string;
}

/**
 * Compute word-level diff between two strings.
 * Uses a longest-common-subsequence approach on word tokens.
 */
export function computeWordDiff(oldText: string, newText: string): DiffSegment[] {
  if (oldText === newText) {
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

  // Build LCS table
  const m = oldWords.length;
  const n = newWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const segments: DiffSegment[] = [];
  let i = m;
  let j = n;

  const rawSegments: DiffSegment[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
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
