/**
 * Scorecards — structured content
 * No fabricated scores. Until real tests exist, use prototype state.
 */
export type ScorecardProduct = { id: string; name: string; href?: string };
export type ScorecardTask = { id: string; label: string; description?: string };

export type Scorecard = {
  id: string;
  slug: string;
  title: string;
  department: string;
  products: ScorecardProduct[];
  tasks: ScorecardTask[];
  verdicts?: string[];
  testDate: string | null; // ISO date or null when not tested
  status: "prototype" | "planned" | "in_progress" | "completed";
  evidenceHref?: string;
  disclosure?: string;
};

// Featured scorecard for homepage hero — prototype per spec §6
export const featuredScorecard: Scorecard = {
  id: "ai-visibility-initial",
  slug: "ai-visibility",
  title: "AI Search Visibility",
  department: "AI Search Visibility",
  products: [
    { id: "p-a", name: "Product A" },
    { id: "p-b", name: "Product B" },
    { id: "p-c", name: "Product C" },
  ],
  tasks: [
    { id: "task-a", label: "Task A" },
    { id: "task-b", label: "Task B" },
    { id: "task-c", label: "Task C" },
  ],
  testDate: null,
  status: "prototype",
  evidenceHref: "/scorecards",
  disclosure: "Prototype structure only — no product data has been fabricated.",
};
