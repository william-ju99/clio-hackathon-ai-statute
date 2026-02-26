"use client";

import { useMemo } from "react";
import { computeWordDiff, DiffSegment } from "@/lib/diff";

interface TextDiffViewProps {
  originalText: string;
  updatedText: string;
}

function DiffSegments({ segments }: { segments: DiffSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "equal") {
          return <span key={i}>{seg.value}</span>;
        }
        if (seg.type === "removed") {
          return (
            <span
              key={i}
              className="bg-red-100 text-red-800 line-through decoration-red-400/60"
            >
              {seg.value}
            </span>
          );
        }
        return (
          <span key={i} className="bg-green-100 text-green-800">
            {seg.value}
          </span>
        );
      })}
    </>
  );
}

/**
 * Split statute text into logical paragraphs (subsections).
 * Paragraphs are separated by double-newlines.
 */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** How far ahead to scan when trying to re-sync misaligned paragraphs. */
const LOOK_AHEAD = 15;

/**
 * Extract the subsection / sub-item prefix from a paragraph, if any.
 * Matches (1), (1.3), (10.5), (a), (b), etc.
 */
function extractPrefix(text: string): string | null {
  return text.match(/^\([a-z0-9][\d.]*\)/i)?.[0] ?? null;
}

/**
 * Try to match paragraphs between the original and updated text.
 * Returns a list of pairs [original | null, updated | null].
 */
function alignParagraphs(
  origParagraphs: string[],
  updatedParagraphs: string[]
): Array<[string | null, string | null]> {
  const pairs: Array<[string | null, string | null]> = [];

  let i = 0;
  let j = 0;

  while (i < origParagraphs.length && j < updatedParagraphs.length) {
    const orig = origParagraphs[i];
    const updated = updatedParagraphs[j];

    // If they start with the same subsection prefix, they're aligned
    const origPrefix = extractPrefix(orig);
    const updatedPrefix = extractPrefix(updated);

    if (origPrefix && updatedPrefix && origPrefix === updatedPrefix) {
      pairs.push([orig, updated]);
      i++;
      j++;
    } else if (orig === updated) {
      pairs.push([orig, updated]);
      i++;
      j++;
    } else {
      // Look ahead to see if the original paragraph exists later in updated
      const lookAheadUpdated = updatedParagraphs
        .slice(j + 1, j + LOOK_AHEAD)
        .findIndex((p) => {
          const pPrefix = extractPrefix(p);
          return origPrefix && pPrefix === origPrefix;
        });

      const lookAheadOrig = origParagraphs
        .slice(i + 1, i + LOOK_AHEAD)
        .findIndex((p) => {
          const pPrefix = extractPrefix(p);
          return updatedPrefix && pPrefix === updatedPrefix;
        });

      if (lookAheadUpdated !== -1) {
        // Updated has extra paragraphs before this one
        for (let k = 0; k <= lookAheadUpdated; k++) {
          pairs.push([null, updatedParagraphs[j + k]]);
        }
        j += lookAheadUpdated + 1;
      } else if (lookAheadOrig !== -1) {
        // Original has extra paragraphs before this one
        for (let k = 0; k <= lookAheadOrig; k++) {
          pairs.push([origParagraphs[i + k], null]);
        }
        i += lookAheadOrig + 1;
      } else {
        // Just pair them and move on
        pairs.push([orig, updated]);
        i++;
        j++;
      }
    }
  }

  while (i < origParagraphs.length) {
    pairs.push([origParagraphs[i], null]);
    i++;
  }
  while (j < updatedParagraphs.length) {
    pairs.push([null, updatedParagraphs[j]]);
    j++;
  }

  return pairs;
}

export function TextDiffView({ originalText, updatedText }: TextDiffViewProps) {
  const pairs = useMemo(() => {
    const origParagraphs = splitParagraphs(originalText);
    const updatedParagraphs = splitParagraphs(updatedText);
    return alignParagraphs(origParagraphs, updatedParagraphs);
  }, [originalText, updatedText]);

  // Find which pairs have actual changes
  const changedIndices = useMemo(() => {
    const set = new Set<number>();
    pairs.forEach(([orig, updated], idx) => {
      if (orig !== updated) set.add(idx);
    });
    return set;
  }, [pairs]);

  return (
    <div className="space-y-1">
      {pairs.map(([orig, updated], idx) => {
        const hasChange = changedIndices.has(idx);

        if (!hasChange) {
          // Unchanged paragraph — show it muted
          return (
            <div key={idx} className="px-4 py-2 text-sm leading-relaxed text-muted-foreground">
              {orig}
            </div>
          );
        }

        // Changed paragraph
        if (orig && updated) {
          const diff = computeWordDiff(orig, updated);
          return (
            <div
              key={idx}
              className="rounded-md border border-amber-200 bg-amber-50/50 px-4 py-3"
            >
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-600">
                Modified
              </div>
              <p className="text-sm leading-relaxed">
                <DiffSegments segments={diff} />
              </p>
            </div>
          );
        }

        if (!orig && updated) {
          return (
            <div
              key={idx}
              className="rounded-md border border-green-200 bg-green-50/50 px-4 py-3"
            >
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-green-600">
                Added
              </div>
              <p className="text-sm leading-relaxed text-green-900">
                {updated}
              </p>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="rounded-md border border-red-200 bg-red-50/50 px-4 py-3"
          >
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-red-600">
              Removed
            </div>
            <p className="text-sm leading-relaxed text-red-900 line-through">
              {orig}
            </p>
          </div>
        );
      })}
    </div>
  );
}
