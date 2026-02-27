"use client";

import { useMemo, Fragment, type ReactNode } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { computeWordDiff, DiffSegment } from "@/lib/diff";
import { cn } from "@/lib/utils";

export type ParagraphDecision = "approved" | "rejected" | null;

interface TextDiffViewProps {
  originalText: string;
  updatedText: string;
  /** When provided, shows Approve/Reject/Undo per changed paragraph */
  decisions?: Record<number, ParagraphDecision>;
  onDecision?: (index: number, decision: ParagraphDecision) => void;
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

/**
 * Compute the resolved statute text after applying reviewer decisions.
 * Approved changes use updated text; rejected use original; pending use original.
 */
export function getResolvedStatuteText(
  originalText: string,
  updatedText: string,
  decisions: Record<number, ParagraphDecision>
): string {
  const origParagraphs = splitParagraphs(originalText);
  const updatedParagraphs = splitParagraphs(updatedText);
  const pairs = alignParagraphs(origParagraphs, updatedParagraphs);

  const paragraphs: string[] = [];
  for (let idx = 0; idx < pairs.length; idx++) {
    const [orig, updated] = pairs[idx];
    const decision = decisions[idx] ?? null;
    const hasChange = orig !== updated;

    if (!hasChange) {
      paragraphs.push(orig!);
      continue;
    }
    if (decision === "rejected") {
      if (!orig && updated) continue; // rejected addition: omit
      paragraphs.push(orig!);
      continue;
    }
    if (decision === "approved") {
      if (orig && !updated) continue; // approved removal: omit
      paragraphs.push(updated!);
      continue;
    }
    // Pending: keep original
    paragraphs.push(orig ?? updated!);
  }
  return paragraphs.join("\n\n");
}

const paragraphClass = "px-4 py-2 text-sm leading-relaxed text-foreground";

/**
 * Renders the finalized statute (with approved changes applied).
 * Can show plain text or the same text with approved changes highlighted inline.
 */
export function ResolvedStatuteView({
  originalText,
  updatedText,
  decisions,
  highlightApprovedChanges,
}: {
  originalText: string;
  updatedText: string;
  decisions: Record<number, ParagraphDecision>;
  highlightApprovedChanges: boolean;
}) {
  const pairs = useMemo(() => {
    const origParagraphs = splitParagraphs(originalText);
    const updatedParagraphs = splitParagraphs(updatedText);
    return alignParagraphs(origParagraphs, updatedParagraphs);
  }, [originalText, updatedText]);

  const items = useMemo(() => {
    const result: Array<{ key: number; content: ReactNode }> = [];
    let key = 0;
    for (let idx = 0; idx < pairs.length; idx++) {
      const [orig, updated] = pairs[idx];
      const decision = decisions[idx] ?? null;
      const hasChange = orig !== updated;

      let resolvedText: string;
      let showHighlight = false;
      let origForDiff: string | null = null;
      let updatedForDiff: string | null = null;
      let type: "unchanged" | "modified" | "added" | "removed" = "unchanged";

      if (!hasChange) {
        resolvedText = orig!;
      } else if (decision === "rejected") {
        if (!orig && updated) continue; // omit rejected addition
        resolvedText = orig!;
      } else if (decision === "approved") {
        if (orig && !updated) continue; // omit approved removal
        resolvedText = updated!;
        showHighlight = highlightApprovedChanges;
        if (orig && updated) {
          type = "modified";
          origForDiff = orig;
          updatedForDiff = updated;
        } else if (!orig && updated) {
          type = "added";
        }
      } else {
        resolvedText = orig ?? updated!;
      }

      if (showHighlight && type === "modified" && origForDiff && updatedForDiff) {
        const diff = computeWordDiff(origForDiff, updatedForDiff);
        result.push({
          key: key++,
          content: (
            <div key={idx} className={paragraphClass}>
              <DiffSegments segments={diff} />
            </div>
          ),
        });
      } else if (showHighlight && type === "added") {
        result.push({
          key: key++,
          content: (
            <div key={idx} className={paragraphClass}>
              <span className="bg-green-100 text-green-800">{resolvedText}</span>
            </div>
          ),
        });
      } else {
        result.push({
          key: key++,
          content: (
            <div key={idx} className={paragraphClass}>
              {resolvedText}
            </div>
          ),
        });
      }
    }
    return result;
  }, [pairs, decisions, highlightApprovedChanges]);

  return (
    <div className="space-y-1">
      {items.map(({ key, content }) => (
        <Fragment key={key}>{content}</Fragment>
      ))}
    </div>
  );
}

function SmallUndoButton({
  onUndo,
}: {
  onUndo: () => void;
}) {
  return (
    <button
      onClick={onUndo}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
      type="button"
    >
      <RotateCcw className="h-3 w-3" />
      Undo
    </button>
  );
}

export function TextDiffView({
  originalText,
  updatedText,
  decisions = {},
  onDecision,
}: TextDiffViewProps) {
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

  const showDecisions = onDecision != null;

  return (
    <div className="space-y-1">
      {pairs.map(([orig, updated], idx) => {
        const hasChange = changedIndices.has(idx);
        const decision = decisions[idx] ?? null;

        if (!hasChange) {
          return (
            <div key={idx} className={paragraphClass}>
              {orig}
            </div>
          );
        }

        const decided = decision !== null;
        const undoButton = showDecisions && decided && (
          <SmallUndoButton onUndo={() => onDecision(idx, null)} />
        );

        // Rejected: change does not show — show original (or nothing for added) + Undo
        if (decision === "rejected") {
          if (!orig && updated) {
            // Rejected addition: don't show the added text; just Undo
            return (
              <div key={idx} className="flex items-center gap-2 px-4 py-2">
                <span className="shrink-0">{undoButton}</span>
              </div>
            );
          }
          // Rejected modified or rejected removed: show original as normal text
          return (
            <div key={idx} className="flex items-start gap-2">
              <div className={cn("min-w-0 flex-1", paragraphClass)}>
                {orig}
              </div>
              <span className="shrink-0 pt-2">{undoButton}</span>
            </div>
          );
        }

        // Approved: show content with inline highlight on what was added/removed (not the whole paragraph)
        if (decided && decision === "approved") {
          if (orig && updated) {
            const diff = computeWordDiff(orig, updated);
            return (
              <div key={idx} className="flex items-start gap-2">
                <div
                  className={cn(
                    "min-w-0 flex-1 text-sm leading-relaxed text-foreground",
                    paragraphClass
                  )}
                >
                  <DiffSegments segments={diff} />
                </div>
                <span className="shrink-0 pt-2">{undoButton}</span>
              </div>
            );
          }
          if (!orig && updated) {
            return (
              <div key={idx} className="flex items-start gap-2">
                <div
                  className={cn(
                    "min-w-0 flex-1 text-sm leading-relaxed",
                    paragraphClass
                  )}
                >
                  <span className="bg-green-100 text-green-800">{updated}</span>
                </div>
                <span className="shrink-0 pt-2">{undoButton}</span>
              </div>
            );
          }
          // Approved removed: show removed text highlighted (strikethrough/red) + Undo
          return (
            <div key={idx} className="flex items-start gap-2">
              <div
                className={cn(
                  "min-w-0 flex-1 text-sm leading-relaxed",
                  paragraphClass
                )}
              >
                <span className="bg-red-100 text-red-800 line-through decoration-red-400/60">
                  {orig}
                </span>
              </div>
              <span className="shrink-0 pt-2">{undoButton}</span>
            </div>
          );
        }

        // Pending: show box with diff and Approve/Reject
        if (orig && updated) {
          const diff = computeWordDiff(orig, updated);
          return (
            <div
              key={idx}
              className="rounded-md border border-amber-200 bg-amber-50/50 px-4 py-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-amber-600">
                  Modified
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                <DiffSegments segments={diff} />
              </p>
              <div className="mt-3 flex gap-3 border-t border-amber-200/60 pt-3">
                <button
                  onClick={() => onDecision?.(idx, "approved")}
                  className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => onDecision?.(idx, "rejected")}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </div>
          );
        }

        if (!orig && updated) {
          return (
            <div
              key={idx}
              className="rounded-md border border-green-200 bg-green-50/50 px-4 py-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-green-600">
                  Added
                </span>
              </div>
              <p className="text-sm leading-relaxed text-green-900">{updated}</p>
              <div className="mt-3 flex gap-3 border-t border-green-200/60 pt-3">
                <button
                  onClick={() => onDecision?.(idx, "approved")}
                  className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => onDecision?.(idx, "rejected")}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </div>
          );
        }

        // Pending removed
        return (
          <div
            key={idx}
            className="rounded-md border border-red-200 bg-red-50/50 px-4 py-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-red-600">
                Removed
              </span>
            </div>
            <p className="text-sm leading-relaxed text-red-900 line-through">
              {orig}
            </p>
            <div className="mt-3 flex gap-3 border-t border-red-200/60 pt-3">
              <button
                onClick={() => onDecision?.(idx, "approved")}
                className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => onDecision?.(idx, "rejected")}
                className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
