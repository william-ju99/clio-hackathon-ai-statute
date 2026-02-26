"use client";

interface PdfPanelProps {
  pdfUrl: string;
  label: string;
}

export function PdfPanel({ pdfUrl, label }: PdfPanelProps) {
  return (
    <div className="sticky top-20 self-start">
      <div className="flex flex-col rounded-lg border bg-white shadow-sm overflow-hidden" style={{ height: "calc(100vh - 8rem)" }}>
        {/* Header */}
        <div className="shrink-0 border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              Session Law
            </span>
          </div>
        </div>

        {/* PDF Embed — fills viewport height and stays sticky while scrolling */}
        <div className="flex-1 min-h-0">
          <iframe
            src={`${pdfUrl}#zoom=90`}
            className="h-full w-full border-0"
            title="Session Law PDF"
          />
        </div>
      </div>
    </div>
  );
}
