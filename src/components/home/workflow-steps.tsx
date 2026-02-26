"use client";

import { FileSearch, Cpu, Eye, ClipboardCheck, CheckSquare } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "1. Select a Bill",
    description:
      "Choose a 2025 Colorado bill that amends specific sections of law. The system loads the session law PDF and identifies add/delete instructions.",
    status: "ready" as const,
  },
  {
    icon: Cpu,
    title: "2. AI Codification",
    description:
      "The LLM extracts changes (underlined = added, strikethrough = deleted) and applies them to the current statute text, generating the updated version with history notes.",
    status: "ready" as const,
  },
  {
    icon: Eye,
    title: "3. Review Diff",
    description:
      "View a side-by-side comparison: the old statute on the left, session law in the middle, and the AI-generated new statute on the right.",
    status: "ready" as const,
  },
  {
    icon: ClipboardCheck,
    title: "4. Review Dashboard",
    description:
      "Editors approve, reject, or manually edit each AI-generated change. The human stays in the loop as the quality gatekeeper.",
    status: "ready" as const,
  },
  {
    icon: CheckSquare,
    title: "5. Integration",
    description:
      "Finalized changes are formatted for the vLex/Clio database and exported as clean data set versions.",
    status: "coming-soon" as const,
  },
];

export function WorkflowSteps() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-clio-navy">
            Pilot Workflow
          </h2>
          <p className="text-muted-foreground">
            Five steps from session law to codified statute
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group relative rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-clio-blue/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-clio-blue/10 text-clio-blue transition-colors group-hover:bg-clio-blue group-hover:text-white">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-clio-navy">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
