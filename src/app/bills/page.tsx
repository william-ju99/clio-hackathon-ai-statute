import { Header } from "@/components/layout/header";
import { BillList } from "@/components/bills/bill-list";

export default function BillsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-clio-navy">
          Colorado Bills
        </h1>
        <p className="mb-8 text-muted-foreground">
          Select a 2025 Colorado bill to view the AI-generated statute changes.
        </p>
        <BillList />
      </main>
    </div>
  );
}
