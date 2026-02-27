"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-clio-blue-light via-white to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-clio-blue/5 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-clio-blue/3 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-clio-blue/20 bg-clio-blue/5 px-4 py-1.5 text-sm font-medium text-clio-blue">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-clio-blue animate-pulse" />
            Colorado Pilot — 2025
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-clio-navy sm:text-5xl">
            Automated Statute{" "}
            <span className="text-clio-blue">Codification</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
            Transform session law PDFs into updated statute text using AI.
            Select a Colorado bill, review the AI-generated changes in a
            side-by-side diff view, and approve or reject each edit.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/bills"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-clio-blue px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-clio-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clio-blue"
            >
              <FileText className="mr-2 h-4 w-4" />
              Codify a Session Law
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
