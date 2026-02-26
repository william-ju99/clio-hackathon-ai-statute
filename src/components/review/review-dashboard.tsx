"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  GitCompare,
  Columns3,
} from "lucide-react";
import { type ProcessResponse } from "@/lib/api";
import { cleanStatuteText } from "@/lib/clean-text";
import { TextDiffView } from "./text-diff-view";
import { PdfPanel } from "./pdf-panel";
import { cn } from "@/lib/utils";

type ViewMode = "diff" | "side-by-side";

interface ReviewDashboardProps {
  data: ProcessResponse;
}

/**
 * Render the analysis markdown as simple styled paragraphs.
 * The analysis uses **bold** markers and line breaks.
 */
function AnalysisCard({ analysis }: { analysis: string }) {
  // Split on double newlines to get paragraphs
  const paragraphs = analysis.split(/\n\n+/).filter(Boolean);

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

  // Strip vLex boilerplate once, share across all views
  const originalText = useMemo(() => cleanStatuteText(data.originalStatuteText), [data.originalStatuteText]);
  const updatedText = useMemo(() => cleanStatuteText(data.updatedStatuteText), [data.updatedStatuteText]);

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
          <div className="border-b bg-muted/30 px-4 py-3">
            <span className="text-sm font-medium text-clio-navy">
              Text Changes
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              Original → Updated statute text
            </span>
          </div>
          <div className="p-4">
            <TextDiffView
              originalText={originalText}
              updatedText={updatedText}
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
          <TextPanel
            text={updatedText}
            label="After — Updated Statute"
            variant="after"
          />
        </div>
      )}
    </div>
  );
}
