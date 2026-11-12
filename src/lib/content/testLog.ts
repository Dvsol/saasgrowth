/**
 * Dated test log — structured content (spec §6 §8)
 * Statuses: Planned, In progress, Completed (only when checked and ready for publication)
 */
export type TestStatus = "planned" | "in_progress" | "completed";

export type TestLogEntry = {
  id: string;
  date: string; // ISO
  title: string; // product or category
  type: string; // test type
  status: TestStatus;
  href?: string;
};

// No completed research yet — show empty/empty-state handling (spec data integrity)
export const testLog: TestLogEntry[] = [
  {
    id: "t1",
    date: "2025-11-15",
    title: "AI Search Visibility — methodology setup",
    type: "Methodology",
    status: "in_progress",
    href: "/method",
  },
  {
    id: "t2",
    date: "2025-11-20",
    title: "Scorecard task definitions — AI Visibility",
    type: "Task design",
    status: "planned",
    href: "/scorecards",
  },
  {
    id: "t3",
    date: "2025-12-01",
    title: "First product test — to be scheduled",
    type: "Product test",
    status: "planned",
  },
];
