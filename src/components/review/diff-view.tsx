"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Pencil } from "lucide-react";
import { computeWordDiff, DiffSegment } from "@/lib/diff";
import { BillChange } from "@/lib/data";
import { cn } from "@/lib/utils";

export type ChangeDecision = "approved" | "rejected" | null;

interface DiffViewProps {
  changes: BillChange[];
  decisions: Record<number, ChangeDecision>;
  edits: Record<number, string>;
  onDecision: (index: number, decision: ChangeDecision) => void;
  onEdit: (index: number, text: string) => void;
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
          <span key={i} className="bg-diff-add-highlight/40 text-green-800">
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

function EditPanel({
  initialText,
  onSave,
  onCancel,
}: {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText);

  return (
    <div className="border-t bg-muted/10 p-4">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Edit text
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full rounded-md border bg-white px-3 py-2 text-sm leading-relaxed text-foreground focus:border-clio-blue focus:outline-none focus:ring-1 focus:ring-clio-blue"
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onSave(text)}
          className="text-xs font-medium text-clio-blue hover:text-clio-blue-dark"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function DiffView({
  changes,
  decisions,
  edits,
  onDecision,
  onEdit,
}: DiffViewProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {changes.map((change, idx) => {
        const effectiveNewText = edits[idx] ?? change.newText;
        const diff = computeWordDiff(change.oldText, effectiveNewText);
        const decision = decisions[idx] ?? null;
        const isEditing = editingIdx === idx;
        const hasCustomEdit = edits[idx] !== undefined;

        return (
          <div
            key={idx}
            className={cn(
              "overflow-hidden rounded-lg border bg-white shadow-sm transition-all",
              decision === "approved" &&
                "border-green-300 ring-1 ring-green-200",
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
              <div className="ml-auto flex items-center gap-2">
                {hasCustomEdit && (
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Edited
                  </span>
                )}
                <DecisionBadge decision={decision} />
              </div>
            </div>

            {/* Diff content */}
            <div
              className={cn("p-4", decision === "rejected" && "opacity-50")}
            >
              {change.type === "added" ? (
                <div className="rounded-md border border-green-200 bg-diff-add p-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-green-600">
                    Added
                  </div>
                  <p className="text-sm leading-relaxed text-green-900">
                    {effectiveNewText}
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

            {/* Edit panel */}
            {isEditing && (
              <EditPanel
                initialText={effectiveNewText}
                onSave={(text) => {
                  onEdit(idx, text);
                  setEditingIdx(null);
                }}
                onCancel={() => setEditingIdx(null)}
              />
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 border-t px-4 py-2">
              {decision === null ? (
                <>
                  <button
                    onClick={() => onDecision(idx, "approved")}
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => onDecision(idx, "rejected")}
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                  {change.type !== "repealed" && (
                    <button
                      onClick={() =>
                        setEditingIdx(isEditing ? null : idx)
                      }
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onDecision(idx, null)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
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
