"use client";

import { useEffect, useState, use } from "react";
import { Header } from "@/components/layout/header";
import { ReviewDashboard } from "@/components/review/review-dashboard";
import { processBill, type ProcessResponse } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ReviewPageProps {
  params: Promise<{ billId: string }>;
}

export default function ReviewBillPage({ params }: ReviewPageProps) {
  const { billId } = use(params);
  const billNumber = decodeURIComponent(billId);

  const [data, setData] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await processBill(billNumber);
        if (!cancelled) setData(response);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [billNumber]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-clio-blue" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-clio-navy">
                Analyzing {billNumber}…
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Downloading the session law, extracting text, and generating
                the updated statute. This may take a minute.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-lg rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <h2 className="font-semibold text-red-800">
                  Failed to process bill
                </h2>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <Link
                  href="/bills"
                  className="mt-3 inline-block text-sm font-medium text-red-800 underline hover:text-red-900"
                >
                  ← Try a different bill
                </Link>
              </div>
            </div>
          </div>
        )}

        {data && <ReviewDashboard data={data} />}
      </main>
    </div>
  );
}
