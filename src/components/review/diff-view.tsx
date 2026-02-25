"use client";

import { Check, X, RotateCcw } from "lucide-react";
import { computeWordDiff, DiffSegment } from "@/lib/diff";
import { BillChange } from "@/lib/data";
import { cn } from "@/lib/utils";

export type ChangeDecision = "approved" | "rejected" | null;

interface DiffViewProps {
  changes: BillChange[];
  decisions: Record<number, ChangeDecision>;
  onDecision: (index: number, decision: ChangeDecision) => void;
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
              className="bg-diff-remove-highlight/40 text-red-800 line-through decoration-red-400/60"
            >
              {seg.value}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="bg-diff-add-highlight/40 text-green-800"
          >
            {seg.value}
          </span>
        );
      })}
    </>
  );
}

function ChangeTypeBadge({ type }: { type: BillChange["type"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
        type === "amended" && "bg-amber-50 text-amber-700",
        type === "added" && "bg-green-50 text-green-700",
        type === "repealed" && "bg-red-50 text-red-700"
      )}
    >
      {type}
    </span>
  );
}

function DecisionBadge({ decision }: { decision: ChangeDecision }) {
  if (!decision) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        decision === "approved" && "bg-green-100 text-green-800",
        decision === "rejected" && "bg-red-100 text-red-800"
      )}
    >
      {decision === "approved" ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      {decision === "approved" ? "Approved" : "Rejected"}
    </span>
  );
}

export function DiffView({ changes, decisions, onDecision }: DiffViewProps) {
  return (
    <div className="space-y-6">
      {changes.map((change, idx) => {
        const diff = computeWordDiff(change.oldText, change.newText);
        const decision = decisions[idx] ?? null;

        return (
          <div
            key={idx}
            className={cn(
              "overflow-hidden rounded-lg border bg-white shadow-sm transition-all",
              decision === "approved" && "border-green-300 ring-1 ring-green-200",
              decision === "rejected" && "border-red-300 ring-1 ring-red-200"
            )}
          >
            {/* Change header */}
            <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
              <ChangeTypeBadge type={change.type} />
              <span className="font-mono text-sm font-medium text-clio-navy">
                {change.subsection}
              </span>
              <span className="text-sm text-muted-foreground">
                {change.description}
              </span>
              <div className="ml-auto">
                <DecisionBadge decision={decision} />
              </div>
            </div>

            {/* Unified diff view */}
            <div className={cn("p-4", decision === "rejected" && "opacity-50")}>
              {change.type === "added" ? (
                <div className="rounded-md border border-green-200 bg-diff-add p-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-green-600">
                    Added
                  </div>
                  <p className="text-sm leading-relaxed text-green-900">
                    {change.newText}
                  </p>
                </div>
              ) : change.type === "repealed" ? (
                <div className="rounded-md border border-red-200 bg-diff-remove p-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-red-600">
                    Repealed
                  </div>
                  <p className="text-sm leading-relaxed text-red-900 line-through">
                    {change.oldText}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-md border border-red-200 bg-diff-remove p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-red-600">
                      Before
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      <DiffSegments
                        segments={diff.filter((s) => s.type !== "added")}
                      />
                    </p>
                  </div>
                  <div className="rounded-md border border-green-200 bg-diff-add p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-green-600">
                      After
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      <DiffSegments
                        segments={diff.filter((s) => s.type !== "removed")}
                      />
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Approve / Reject buttons */}
            <div className="flex items-center gap-2 border-t bg-muted/20 px-4 py-3">
              {decision === null ? (
                <>
                  <button
                    onClick={() => onDecision(idx, "approved")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => onDecision(idx, "rejected")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onDecision(idx, null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="h-4 w-4" />
                  Undo
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
