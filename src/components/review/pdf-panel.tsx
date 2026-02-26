"use client";

import { useEffect, useState } from "react";
import { base64PdfToUrl } from "@/lib/api";

interface PdfPanelProps {
  /** Either a URL path (e.g. "/foo.pdf") or a raw base64 string */
  pdfUrl?: string;
  pdfBase64?: string;
  label: string;
}

export function PdfPanel({ pdfUrl, pdfBase64, label }: PdfPanelProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBase64) {
      const url = base64PdfToUrl(pdfBase64);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfBase64]);

  const src = blobUrl ?? pdfUrl;

  return (
    <div className="sticky top-20 self-start">
      <div
        className="flex flex-col rounded-lg border bg-white shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 8rem)" }}
      >
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

        {/* PDF Embed */}
        <div className="flex-1 min-h-0">
          {src ? (
            <iframe
              src={`${src}#zoom=90`}
              className="h-full w-full border-0"
              title="Session Law PDF"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No PDF available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
