import { Header } from "@/components/layout/header";
import { BillInput } from "@/components/bills/bill-input";

export default function BillsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-clio-navy">
          Colorado Statute Analyzer
        </h1>
        <p className="mb-8 text-muted-foreground">
          Enter a bill number to analyze its impact on existing Colorado
          statutes using AI.
        </p>
        <BillInput />
      </main>
    </div>
  );
}
