"use client";

import { StatuteSection } from "@/lib/data";

interface StatutePanelProps {
  statute: StatuteSection;
  label: string;
  variant?: "before" | "after";
}

export function StatutePanel({
  statute,
  label,
  variant = "before",
}: StatutePanelProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {/* Header */}
      <div className="border-b bg-muted/30 px-4 py-3">
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
        <h3 className="mt-1 font-semibold text-clio-navy">{statute.title}</h3>
        <p className="text-xs text-muted-foreground">{statute.citation}</p>
      </div>

      {/* Metadata */}
      <div className="border-b px-4 py-2 text-xs text-muted-foreground">
        <span className="font-medium">Library:</span> {statute.library} ·{" "}
        <span className="font-medium">Edition:</span> {statute.edition} ·{" "}
        <span className="font-medium">Year:</span> {statute.year}
      </div>

      {/* Subsections */}
      <div className="px-4 py-4 space-y-3">
        {statute.subsections.map((sub) => (
          <p key={sub.number} className="text-sm leading-relaxed">
            <span className="font-medium">{sub.number}</span> {sub.text}
          </p>
        ))}
      </div>

      {/* History */}
      <div className="border-t bg-muted/20 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">History:</span> {statute.history}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-semibold">Cite as:</span> {statute.citeAs}
        </p>
        {statute.editorsNote && (
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-semibold">Editor&apos;s Note:</span>{" "}
            {statute.editorsNote}
          </p>
        )}
      </div>
    </div>
  );
}
