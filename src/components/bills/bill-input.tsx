"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2 } from "lucide-react";

export function BillInput() {
  const router = useRouter();
  const [billNumber, setBillNumber] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = billNumber.trim();
    if (!trimmed) return;

    setIsNavigating(true);
    // Navigate to the review page — it will call the API
    router.push(`/review/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <label
          htmlFor="bill-number"
          className="mb-2 block text-sm font-medium text-clio-navy"
        >
          Bill Number
        </label>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter a Colorado bill number (e.g. <strong>HB25-1022</strong>) to
          analyze its impact on existing statutes.
        </p>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="bill-number"
              type="text"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="HB25-1022"
              className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-clio-blue focus:outline-none focus:ring-1 focus:ring-clio-blue"
              disabled={isNavigating}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!billNumber.trim() || isNavigating}
            className="inline-flex items-center gap-2 rounded-lg bg-clio-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-clio-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isNavigating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                Analyze
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
