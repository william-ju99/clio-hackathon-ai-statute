"use client";

import { ExternalLink } from "lucide-react";

export function PilotStatus() {
  return (
    <section className="border-t bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-clio-navy">
            Colorado Pilot Status
          </h2>

          <div className="space-y-4">
            {/* Phase A */}
            <div className="rounded-lg border bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-clio-navy">
                      Phase A: Data Extraction
                    </h3>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      In Progress
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scraping and parsing session law PDFs and current statute
                    text. Extracting underlined (added) and strikethrough
                    (deleted) text from Colorado Session Laws.
                  </p>
                </div>
              </div>
            </div>

            {/* Phase B */}
            <div className="rounded-lg border bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-clio-navy">
                      Phase B: LLM Editor Prompting
                    </h3>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Planned
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Providing the LLM with current law and session law changes
                    to generate updated statute text with proper history notes in
                    Colorado&apos;s format.
                  </p>
                </div>
              </div>
            </div>

            {/* Phase C */}
            <div className="rounded-lg border bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-clio-navy">
                      Phase C: Integration
                    </h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      Upcoming
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Formatting output for vLex/Clio internal database and
                    generating clean, redline, and official data set versions for
                    republishers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team link */}
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span>
              Built by the Clio AI Statutes Hackathon Team — Colorado 2025 Pilot
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
