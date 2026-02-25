/**
 * Dummy data for the Colorado Pilot Workflow.
 *
 * This simulates the data that would come from the Phase A (data extraction)
 * and Phase B (LLM editor) APIs. Replace with real API calls when available.
 */

export interface StatuteSection {
  id: string;
  citation: string;
  title: string;
  library: string;
  edition: string;
  currency: string;
  year: string;
  subsections: {
    number: string;
    text: string;
  }[];
  history: string;
  citeAs: string;
  editorsNote?: string;
}

export interface BillChange {
  sectionId: string;
  subsection: string;
  type: "amended" | "added" | "repealed";
  oldText: string;
  newText: string;
  description: string;
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  session: string;
  status: string;
  summary: string;
  sectionsAffected: string[];
  changes: BillChange[];
}

// ---------------------------------------------------------------------------
// Current statute text (the "before" state)
// ---------------------------------------------------------------------------

export const statutes: Record<string, StatuteSection> = {
  "1-1-103": {
    id: "1-1-103",
    citation: "C.R.S. § 1-1-103",
    title: "Election Code Liberally Construed",
    library: "Colorado Revised Statutes",
    edition: "2026",
    currency: "Current through the 11/4/2025 election",
    year: "2026",
    subsections: [
      {
        number: "(1)",
        text: "This code shall be liberally construed so that all eligible electors may be permitted to vote and those who are not eligible electors may be kept from voting in order to prevent fraud and corruption in elections.",
      },
      {
        number: "(2)",
        text: "It is also the intent of the general assembly that non-English-speaking citizens, like all other citizens, should be encouraged to vote. Therefore, appropriate efforts should be made to minimize obstacles to registration by citizens who lack sufficient skill in English to register without assistance.",
      },
      {
        number: "(3)",
        text: "Substantial compliance with the provisions or intent of this code shall be all that is required for the proper conduct of an election to which this code applies.",
      },
    ],
    history:
      "L. 92: Entire article R&RE, p. 624, § 1, effective 1/1/1993. L. 96: (1) amended and (3) added, p. 1732, § 1, effective July 1.",
    citeAs: "C.R.S. § 1-1-103",
    editorsNote:
      "This section is similar to former § 1-1-103 as it existed prior to 1992.",
  },
};

// ---------------------------------------------------------------------------
// Dummy bill that amends the statute above
// ---------------------------------------------------------------------------

export const bills: Bill[] = [
  {
    id: "hb25-1001",
    number: "HB25-1001",
    title: "Modernize Election Code Language and Accessibility",
    session: "2025 Regular Session",
    status: "Signed by Governor",
    summary:
      "Amends C.R.S. § 1-1-103 to update language around voter accessibility, expand non-English-speaking voter protections, and add a new subsection requiring digital accessibility for election materials.",
    sectionsAffected: ["1-1-103"],
    changes: [
      {
        sectionId: "1-1-103",
        subsection: "(1)",
        type: "amended",
        oldText:
          "This code shall be liberally construed so that all eligible electors may be permitted to vote and those who are not eligible electors may be kept from voting in order to prevent fraud and corruption in elections.",
        newText:
          "This code shall be liberally construed so that all eligible electors may be permitted to vote and those who are not eligible electors may be kept from voting in order to prevent fraud and corruption in elections. Election officials shall take all reasonable steps to ensure that voting is accessible to electors with disabilities.",
        description:
          "Adds accessibility requirement for electors with disabilities.",
      },
      {
        sectionId: "1-1-103",
        subsection: "(2)",
        type: "amended",
        oldText:
          "It is also the intent of the general assembly that non-English-speaking citizens, like all other citizens, should be encouraged to vote. Therefore, appropriate efforts should be made to minimize obstacles to registration by citizens who lack sufficient skill in English to register without assistance.",
        newText:
          "It is also the intent of the general assembly that non-English-speaking citizens, like all other citizens, should be encouraged to vote. Therefore, appropriate efforts shall be made to minimize obstacles to registration and voting by citizens who lack sufficient skill in English to register or vote without assistance. Counties shall provide multilingual election materials in accordance with federal requirements and any additional languages identified by the secretary of state.",
        description:
          "Strengthens language from 'should' to 'shall', expands scope to include voting (not just registration), and mandates multilingual materials.",
      },
      {
        sectionId: "1-1-103",
        subsection: "(4)",
        type: "added",
        oldText: "",
        newText:
          "All election materials published by the state or any political subdivision thereof shall be made available in a digital format that meets or exceeds the accessibility standards established by the secretary of state pursuant to section 1-1-107.",
        description:
          "New subsection requiring digital accessibility for election materials.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a bill by ID */
export function getBill(id: string): Bill | undefined {
  return bills.find((b) => b.id === id);
}

/** Get a statute section by ID */
export function getStatute(id: string): StatuteSection | undefined {
  return statutes[id];
}

/**
 * Generate the "after" version of a statute by applying a bill's changes.
 * Returns the updated statute with a new history line appended.
 */
export function applyBillToStatute(
  statute: StatuteSection,
  bill: Bill
): StatuteSection {
  const changes = bill.changes.filter((c) => c.sectionId === statute.id);
  return applyChangesToStatute(statute, changes, bill.number);
}

/**
 * Apply a filtered set of changes to a statute.
 * Used by the review dashboard to apply only approved changes.
 */
export function applyChangesToStatute(
  statute: StatuteSection,
  changes: BillChange[],
  billNumber?: string
): StatuteSection {
  const updatedSubsections = [...statute.subsections];

  for (const change of changes) {
    if (change.type === "amended") {
      const idx = updatedSubsections.findIndex(
        (s) => s.number === change.subsection
      );
      if (idx !== -1) {
        updatedSubsections[idx] = {
          ...updatedSubsections[idx],
          text: change.newText,
        };
      }
    } else if (change.type === "added") {
      updatedSubsections.push({
        number: change.subsection,
        text: change.newText,
      });
    } else if (change.type === "repealed") {
      const idx = updatedSubsections.findIndex(
        (s) => s.number === change.subsection
      );
      if (idx !== -1) {
        updatedSubsections.splice(idx, 1);
      }
    }
  }

  // Sort subsections by number
  updatedSubsections.sort((a, b) => a.number.localeCompare(b.number));

  // Build a dynamic history line based on which changes were applied
  const amended = changes.filter((c) => c.type === "amended").map((c) => c.subsection);
  const added = changes.filter((c) => c.type === "added").map((c) => c.subsection);
  const repealed = changes.filter((c) => c.type === "repealed").map((c) => c.subsection);
  const parts: string[] = [];
  if (amended.length) parts.push(`${amended.join(", ")} amended`);
  if (added.length) parts.push(`${added.join(", ")} added`);
  if (repealed.length) parts.push(`${repealed.join(", ")} repealed`);

  let history = statute.history;
  if (parts.length > 0) {
    const ref = billNumber ? `, ${billNumber}` : "";
    history = `${statute.history} L. 25: ${parts.join(" and ")}${ref}, effective upon signature.`;
  }

  return {
    ...statute,
    subsections: updatedSubsections,
    history,
  };
}
