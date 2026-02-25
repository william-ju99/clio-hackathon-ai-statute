"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { bills } from "@/lib/data";

export function BillList() {
  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Link
          key={bill.id}
          href={`/review/${bill.id}`}
          className="group block rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-clio-blue/30"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-clio-blue/10 text-clio-blue transition-colors group-hover:bg-clio-blue group-hover:text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-clio-navy">
                    {bill.number}
                  </h2>
                </div>
                <h3 className="mt-0.5 font-medium text-foreground">
                  {bill.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {bill.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {bill.sectionsAffected.map((section) => (
                    <span
                      key={section}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                    >
                      C.R.S. § {section}
                    </span>
                  ))}
                  <span className="inline-flex items-center text-xs text-muted-foreground">
                    · {bill.changes.length} change
                    {bill.changes.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-clio-blue" />
          </div>
        </Link>
      ))}
    </div>
  );
}
