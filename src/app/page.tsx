import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/home/hero-section";
import { WorkflowSteps } from "@/components/home/workflow-steps";
import { PilotStatus } from "@/components/home/pilot-status";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <WorkflowSteps />
        <PilotStatus />
      </main>
    </div>
  );
}
