"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  GitCompare,
  Columns3,
  CheckCircle2,
  XCircle,
  Circle,
} from "lucide-react";
import {
  Bill,
  getStatute,
  applyChangesToStatute,
} from "@/lib/data";
import { DiffView, ChangeDecision } from "./diff-view";
import { StatutePanel } from "./statute-panel";
import { PdfPanel } from "./pdf-panel";
import { cn } from "@/lib/utils";

type ViewMode = "diff" | "side-by-side";

interface ReviewDashboardProps {
  bill: Bill;
}

export function ReviewDashboard({ bill }: ReviewDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("diff");
  const [decisions, setDecisions] = useState<Record<number, ChangeDecision>>(
    {}
  );
  const [edits, setEdits] = useState<Record<number, string>>({});

  const sectionId = bill.sectionsAffected[0];
  const statute = getStatute(sectionId);
  const sectionChanges = useMemo(
    () => bill.changes.filter((c) => c.sectionId === sectionId),
    [bill.changes, sectionId]
  );

  // Build the "after" statute using only approved changes (with any edits applied)
  const updatedStatute = useMemo(() => {
    if (!statute) return null;
    const approvedChanges = sectionChanges
      .map((change, idx) => {
        if (decisions[idx] !== "approved") return null;
        if (edits[idx] !== undefined) {
          return { ...change, newText: edits[idx] };
        }
        return change;
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
    return applyChangesToStatute(statute, approvedChanges, bill.number);
  }, [decisions, edits, sectionChanges, statute, bill.number]);

  if (!statute) {
    return (
      <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
        Statute data not found for section {sectionId}.
      </div>
    );
  }

  const handleDecision = (index: number, decision: ChangeDecision) => {
    setDecisions((prev) => ({ ...prev, [index]: decision }));
  };

  const handleEdit = (index: number, text: string) => {
    setEdits((prev) => ({ ...prev, [index]: text }));
  };

  // Tally decisions
  const totalChanges = sectionChanges.length;
  const approvedCount = Object.values(decisions).filter(
    (d) => d === "approved"
  ).length;
  const rejectedCount = Object.values(decisions).filter(
    (d) => d === "rejected"
  ).length;
  const pendingCount = totalChanges - approvedCount - rejectedCount;
  const allReviewed = pendingCount === 0;

  return (
    <div>
      {/* Back link + Bill header */}
      <div className="mb-6">
        <Link
          href="/bills"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-clio-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bills
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-clio-navy">
                {bill.number}
              </h1>
            </div>
            <h2 className="mt-1 text-lg text-foreground">{bill.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {bill.summary}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex shrink-0 rounded-lg border bg-muted/50 p-1">
            <button
              onClick={() => setViewMode("diff")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "diff"
                  ? "bg-white text-clio-navy shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GitCompare className="h-4 w-4" />
              Diff
            </button>
            <button
              onClick={() => setViewMode("side-by-side")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "side-by-side"
                  ? "bg-white text-clio-navy shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Columns3 className="h-4 w-4" />
              Side by Side
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-clio-navy">
            {statute.citation}
          </span>
          <span className="text-muted-foreground">— {statute.title}</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-medium">{approvedCount}</span> approved
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="h-3.5 w-3.5" />
            <span className="font-medium">{rejectedCount}</span> rejected
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Circle className="h-3.5 w-3.5" />
            <span className="font-medium">{pendingCount}</span> pending
          </span>
        </div>
      </div>

      {/* Review progress bar */}
      <div className="mb-6">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          {approvedCount > 0 && (
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${(approvedCount / totalChanges) * 100}%` }}
            />
          )}
          {rejectedCount > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${(rejectedCount / totalChanges) * 100}%` }}
            />
          )}
        </div>
        {allReviewed && (
          <p className="mt-2 text-sm font-medium text-green-700">
            ✓ All changes reviewed — {approvedCount} approved, {rejectedCount}{" "}
            rejected
          </p>
        )}
      </div>

      {/* Content */}
      {viewMode === "diff" ? (
        <DiffView
          changes={sectionChanges}
          decisions={decisions}
          edits={edits}
          onDecision={handleDecision}
          onEdit={handleEdit}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <StatutePanel
            statute={statute}
            label="Before — Current Law"
            variant="before"
          />
          {bill.sessionLawPdf ? (
            <PdfPanel
              pdfUrl={bill.sessionLawPdf}
              label="Session Law — Source PDF"
            />
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted/20 p-8 text-sm text-muted-foreground">
              No session law PDF available
            </div>
          )}
          <StatutePanel
            statute={updatedStatute!}
            label="After — Approved Changes Only"
            variant="after"
          />
        </div>
      )}
    </div>
  );
}
