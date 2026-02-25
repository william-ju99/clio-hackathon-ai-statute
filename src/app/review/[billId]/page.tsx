import { Header } from "@/components/layout/header";
import { ReviewDashboard } from "@/components/review/review-dashboard";
import { getBill } from "@/lib/data";
import { notFound } from "next/navigation";

interface ReviewPageProps {
  params: Promise<{ billId: string }>;
}

export default async function ReviewBillPage({ params }: ReviewPageProps) {
  const { billId } = await params;
  const bill = getBill(billId);

  if (!bill) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <ReviewDashboard bill={bill} />
      </main>
    </div>
  );
}
