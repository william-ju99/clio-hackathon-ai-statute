"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  GitCompare,
  Columns3,
  Download,
} from "lucide-react";
import { type ProcessResponse } from "@/lib/api";
import { cleanStatuteText } from "@/lib/clean-text";
import {
  TextDiffView,
  getResolvedStatuteText,
  ResolvedStatuteView,
  HighlightedAfterView,
  type ParagraphDecision,
} from "./text-diff-view";
import { PdfPanel } from "./pdf-panel";
import { cn } from "@/lib/utils";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildStatuteXml(
  billNumber: string,
  resolvedText: string
): string {
  const paragraphs = resolvedText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const body = paragraphs
    .map((p) => `  <paragraph>${escapeXml(p)}</paragraph>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<statute billNumber="${escapeXml(billNumber)}">
${body}
</statute>
`;
}

type ViewMode = "diff" | "side-by-side";

interface ReviewDashboardProps {
  data: ProcessResponse;
}

/**
 * Render the analysis markdown as simple styled paragraphs.
 * The analysis uses **bold** markers and line breaks.
 */
function AnalysisCard({ analysis }: { analysis: string }) {
  // Strip pipeline steps section if present
  const cleaned = analysis.replace(/=== PIPELINE STEPS ===[\s\S]*?=== CLAUDE ANALYSIS ===\n?/, "").trim();
  // Split on double newlines to get paragraphs
  const paragraphs = cleaned.split(/\n\n+/).filter(Boolean);

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-muted/30 px-4 py-3">
        <span className="text-sm font-medium text-clio-navy">
          AI Analysis
        </span>
      </div>
      <div className="px-4 py-4 space-y-3">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed text-foreground"
            dangerouslySetInnerHTML={{
              __html: p
                .replace(
                  /\*\*(.+?)\*\*/g,
                  '<strong class="font-semibold text-clio-navy">$1</strong>'
                )
                .replace(/\n/g, "<br />"),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TextPanel({
  text,
  label,
  variant,
}: {
  text: string;
  label: string;
  variant: "before" | "after";
}) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
      <div className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span
            className={
              variant === "before"
                ? "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                : "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
            }
          >
            {variant === "before" ? "Current" : "Updated"}
          </span>
        </div>
      </div>
      <div className="px-4 py-4 text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

export function ReviewDashboard({ data }: ReviewDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("diff");
  const [decisions, setDecisions] = useState<Record<number, ParagraphDecision>>({});
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [highlightApprovedInAfter, setHighlightApprovedInAfter] = useState(true);

  // Strip vLex boilerplate once, share across all views
  const originalText = useMemo(() => cleanStatuteText(data.originalStatuteText), [data.originalStatuteText]);
  const updatedText = useMemo(() => cleanStatuteText(data.updatedStatuteText), [data.updatedStatuteText]);

  const handleDecision = (index: number, decision: ParagraphDecision) => {
    setDecisions((prev) => ({ ...prev, [index]: decision }));
  };

  const handleEdit = (index: number, text: string) => {
    setEdits((prev) => ({ ...prev, [index]: text }));
  };

  const handleDownloadXml = useCallback(() => {
    const resolved = getResolvedStatuteText(
      originalText,
      updatedText,
      decisions,
      edits
    );
    const xml = buildStatuteXml(data.billNumber, resolved);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.billNumber.replace(/\s+/g, "-")}-statute.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data.billNumber, originalText, updatedText, decisions, edits]);

  return (
    <div>
      {/* Back link + Header */}
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
                {data.billNumber}
              </h1>
            </div>
            <h2 className="mt-1 text-lg text-foreground">
              Session Law Analysis
            </h2>
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
            {data.billNumber}
          </span>
          <span className="text-muted-foreground">— Statute Update Review</span>
        </div>
      </div>

      {/* Analysis card */}
      <div className="mb-6">
        <AnalysisCard analysis={data.analysis} />
      </div>

      {/* Content */}
      {viewMode === "diff" ? (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
            <div>
              <span className="text-sm font-medium text-clio-navy">
                Text Changes
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                Original → Updated statute text
              </span>
            </div>
            <button
              onClick={handleDownloadXml}
              className="inline-flex items-center gap-1.5 rounded-md border border-clio-blue/30 bg-white px-3 py-1.5 text-sm font-medium text-clio-blue transition-colors hover:bg-clio-blue/5"
            >
              <Download className="h-4 w-4" />
              Download as XML (approved changes)
            </button>
          </div>
          <div className="py-4">
            <TextDiffView
              originalText={originalText}
              updatedText={updatedText}
              decisions={decisions}
              onDecision={handleDecision}
              edits={edits}
              onEdit={handleEdit}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <TextPanel
            text={originalText}
            label="Before — Current Law"
            variant="before"
          />
          <PdfPanel
            pdfBase64={data.sessionLawPdfBase64}
            label="Session Law — Source PDF"
          />
          <div
            className="rounded-lg border bg-white shadow-sm overflow-auto flex flex-col"
            style={{ maxHeight: "calc(100vh - 8rem)" }}
          >
            <div className="sticky top-0 z-10 flex shrink-0 flex-col gap-2 border-b bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  After — Updated Statute
                </span>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  Updated
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-muted/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setHighlightApprovedInAfter(true)}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium transition-colors",
                    highlightApprovedInAfter
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Highlight changes
                </button>
                <button
                  type="button"
                  onClick={() => setHighlightApprovedInAfter(false)}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium transition-colors",
                    !highlightApprovedInAfter
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Plain text
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto px-4 py-4">
              {highlightApprovedInAfter ? (
                <HighlightedAfterView
                  originalText={originalText}
                  updatedText={updatedText}
                />
              ) : (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {updatedText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
