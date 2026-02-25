import { Header } from "@/components/layout/header";

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-clio-navy">
          Review Dashboard
        </h1>
        <p className="mb-8 text-muted-foreground">
          Side-by-side diff view for reviewing AI-generated statute changes.
        </p>
        <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
          Diff review interface will be implemented in Step 2.
        </div>
      </main>
    </div>
  );
}
