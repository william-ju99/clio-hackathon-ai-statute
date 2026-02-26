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
  sessionLawPdf?: string;
  sectionsAffected: string[];
  changes: BillChange[];
}

// ---------------------------------------------------------------------------
// Current statute text (the "before" state)
// Source: C.R.S. § 25-27-102 [Effective 1/1/2025] Definitions
// ---------------------------------------------------------------------------

export const statutes: Record<string, StatuteSection> = {
  "25-27-102": {
    id: "25-27-102",
    citation: "C.R.S. § 25-27-102",
    title: "Definitions",
    library: "Colorado Revised Statutes",
    edition: "2024",
    currency: "Current through 11/5/2024 election",
    year: "2024",
    subsections: [
      {
        number: "(1)",
        text: "Repealed.",
      },
      {
        number: "(1.3)",
        text: '"Assisted living residence" or "residence" means a residential facility that makes available to three or more adults not related to the owner of such facility, either directly or indirectly through an agreement with the resident, room and board and at least the following services: Personal services; protective oversight; social care due to impaired capacity to live independently; and regular supervision that shall be available on a twenty-four-hour basis, but not to the extent that regular twenty-four-hour medical or nursing care is required. The term "assisted living residence" does not include any facility licensed in this state as a residential care facility for individuals with developmental disabilities, or any individual residential support services that are excluded from licensure requirements pursuant to rules adopted by the department of public health and environment.',
      },
      {
        number: "(2)",
        text: '"Department" means the department of public health and environment of the state of Colorado.',
      },
      {
        number: "(2.5)",
        text: '"Direct care worker" means an employee who provides hands-on care, services, and support to residents of an assisted living residence.',
      },
      {
        number: "(2.7)",
        text: '"Fit test" means a test protocol conducted to verify that a respirator or mask is both comfortable and provides the wearer with the expected protection.',
      },
      {
        number: "(3) to (5)",
        text: "Repealed.",
      },
      {
        number: "(6)",
        text: '"Local board of health" means any county, district, or municipal board of health.',
      },
      {
        number: "(6.5)",
        text: '"Local ombudsman" has the same meaning as set forth in section 26-11.5-103 (2).',
      },
      {
        number: "(7)",
        text: "Repealed.",
      },
      {
        number: "(8)",
        text: "(Deleted by amendment, L. 2002, p. 1317, § 2, effective July 1, 2002.)",
      },
      {
        number: "(9)",
        text: '"Personal services" means those services that the operator and employees of an assisted living residence provide for each resident, including, but not limited to: (a) An environment that is sanitary and safe from physical harm; (b) Individualized social supervision; (c) Assistance with transportation; and (d) Assistance with activities of daily living, including but not limited to bathing, dressing, and eating.',
      },
      {
        number: "(9.3)",
        text: '"Portable test" means the following tests for which, when successfully completed by an individual, the individual is provided a certification of completion that may be transferred from one assisted living residence to another in accordance with this section: (a) A fit test; and (b) A tuberculosis test.',
      },
      {
        number: "(9.5)",
        text: '"Portable training" means the following training for which, when successfully completed by an individual, the individual is provided a certification of completion that may be transferred from one assisted living residence to another in accordance with this section: (a) Hand hygiene and infection control; (b) Basic first aid; (c) Resident rights; (d) Person-centered care; (e) Fall prevention; (f) Lift assistance; and (g) Food safety.',
      },
      {
        number: "(10)",
        text: '"Protective oversight" means guidance of a resident as required by the needs of the resident or as reasonably requested by the resident, including the following: (a) Being aware of a resident\'s general whereabouts, although the resident may travel independently in the community; and (b) Monitoring the activities of the resident while on the premises to ensure the resident\'s health, safety, and well-being, including monitoring the resident\'s needs and ensuring that the resident receives the services and care necessary to protect the resident\'s health, safety, and well-being.',
      },
      {
        number: "(10.5)",
        text: '"Qualified medication administration personnel" means an individual who has passed a competency evaluation administered by an approved training entity on or after July 1, 2017, and whose name appears on the department\'s list of individuals who have passed the requisite competency evaluation.',
      },
      {
        number: "(11)",
        text: '"State board" means the state board of health.',
      },
      {
        number: "(12)",
        text: '"State long-term care ombudsman" has the same meaning as set forth in section 26-11.5-103 (7).',
      },
    ],
    history:
      "Amended by 2024 Ch. 447, § 1, eff. 1/1/2025. Amended by 2022 Ch. 323, § 4, eff. 6/2/2022. L. 84: Entire article added, p. 789, § 1, effective July 1. L. 85: (1) and (5) repealed and (9) amended, p. 1362, §§ 23, 24, effective June 28; (3), (4), and (7) repealed and (8) and (9) amended, pp. 928, 924, §§ 7, 2, effective July 1. L. 90: (8) R&RE, p. 1354, § 1, effective July 1. L. 92: (8) amended, p. 1398, § 59, effective July 1. L. 94: (2) and (8) amended, p. 2794, § 542, effective July 1. L. 2001: (8) amended, p. 106, § 3, effective March 21. L. 2002: (1.3) added and (8), (9), and (10) amended, p. 1317, § 2, effective July 1. L. 2010: (6) amended, (HB 10-1422), ch. 419, p. 2107, § 132, effective August 11.",
    citeAs: "C.R.S. § 25-27-102",
    editorsNote:
      "This section is set out more than once due to postponed, multiple, or conflicting amendments.",
  },
};

// ---------------------------------------------------------------------------
// Dummy bill that amends the statute above
// ---------------------------------------------------------------------------

export const bills: Bill[] = [
  {
    id: "hb25-1234",
    number: "HB25-1234",
    title: "Assisted Living Residence Staffing and Training Standards",
    session: "2025 Regular Session",
    status: "Enrolled",
    summary:
      "Amends C.R.S. § 25-27-102 to update assisted living residence definitions, strengthen direct care worker requirements, expand portable training to include dementia care and emergency preparedness, and add a new definition for memory care units.",
    sessionLawPdf: "/HB25-1022_session-law.pdf",
    sectionsAffected: ["25-27-102"],
    changes: [
      {
        sectionId: "25-27-102",
        subsection: "(2.5)",
        type: "amended",
        oldText:
          '"Direct care worker" means an employee who provides hands-on care, services, and support to residents of an assisted living residence.',
        newText:
          '"Direct care worker" means an employee or contracted individual who provides hands-on care, services, and support to residents of an assisted living residence. A direct care worker must complete all portable training requirements within sixty days of the worker\'s start date at any assisted living residence.',
        description:
          "Expands definition to include contracted individuals and adds training completion deadline.",
      },
      {
        sectionId: "25-27-102",
        subsection: "(9.5)",
        type: "amended",
        oldText:
          '"Portable training" means the following training for which, when successfully completed by an individual, the individual is provided a certification of completion that may be transferred from one assisted living residence to another in accordance with this section: (a) Hand hygiene and infection control; (b) Basic first aid; (c) Resident rights; (d) Person-centered care; (e) Fall prevention; (f) Lift assistance; and (g) Food safety.',
        newText:
          '"Portable training" means the following training for which, when successfully completed by an individual, the individual is provided a certification of completion that may be transferred from one assisted living residence to another in accordance with this section: (a) Hand hygiene and infection control; (b) Basic first aid; (c) Resident rights; (d) Person-centered care; (e) Fall prevention; (f) Lift assistance; (g) Food safety; (h) Dementia care and behavioral health awareness; and (i) Emergency preparedness and evacuation procedures.',
        description:
          "Adds dementia care and emergency preparedness to the list of required portable training.",
      },
      {
        sectionId: "25-27-102",
        subsection: "(10)",
        type: "amended",
        oldText:
          '"Protective oversight" means guidance of a resident as required by the needs of the resident or as reasonably requested by the resident, including the following: (a) Being aware of a resident\'s general whereabouts, although the resident may travel independently in the community; and (b) Monitoring the activities of the resident while on the premises to ensure the resident\'s health, safety, and well-being, including monitoring the resident\'s needs and ensuring that the resident receives the services and care necessary to protect the resident\'s health, safety, and well-being.',
        newText:
          '"Protective oversight" means guidance of a resident as required by the needs of the resident or as reasonably requested by the resident, including the following: (a) Being aware of a resident\'s general whereabouts, although the resident may travel independently in the community; (b) Monitoring the activities of the resident while on the premises to ensure the resident\'s health, safety, and well-being, including monitoring the resident\'s needs and ensuring that the resident receives the services and care necessary to protect the resident\'s health, safety, and well-being; and (c) For residents in a memory care unit, ensuring continuous supervision and implementing individualized safety protocols as required by the department.',
        description:
          "Adds memory care-specific supervision requirements under protective oversight.",
      },
      {
        sectionId: "25-27-102",
        subsection: "(12.5)",
        type: "added",
        oldText: "",
        newText:
          '"Memory care unit" means a designated area within an assisted living residence that provides specialized services to residents with Alzheimer\'s disease or other forms of dementia, including secured environments, specialized programming, and staff trained in dementia care pursuant to the portable training requirements of this section.',
        description:
          'New definition for "Memory care unit" to support memory care oversight provisions.',
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
