/**
 * AI Visibility Snapshot — structured content (spec §6 §8)
 * Platforms: ChatGPT, Perplexity, Gemini. Separate mention vs citation.
 * Cell states: Y (mentioned), N (not mentioned), C (citation), U (unable/failure)
 */
export type Platform = "chatgpt" | "perplexity" | "gemini";
export type CellState = "Y" | "N" | "C" | "U" | null;

export type VisibilityPrompt = {
  id: string;
  prompt: string;
};

export type VisibilityRow = {
  promptId: string;
  results: Record<Platform, CellState>;
};

export type VisibilitySnapshot = {
  id: string;
  slug: string;
  title: string;
  testedBrand: string | null;
  category: string | null;
  prompts: VisibilityPrompt[];
  platforms: Platform[];
  rows: VisibilityRow[];
  testDate: string | null;
  methodologyVersion: string;
  evidenceHref?: string;
  limitations?: string;
};

// Initial snapshot — no real run yet, use empty state (spec data integrity)
export const latestSnapshot: VisibilitySnapshot = {
  id: "snapshot-initial",
  slug: "initial",
  title: "AI Visibility Snapshot",
  testedBrand: null, // will be brand/category when first test runs
  category: null,
  prompts: [
    { id: "p1", prompt: "What are the best AI Search Visibility tools for SaaS?" },
    { id: "p2", prompt: "Compare AI visibility software for bootstrapped founders" },
    { id: "p3", prompt: "Which tools track brand mentions in ChatGPT?" },
    { id: "p4", prompt: "Alternatives to [brand] for AI search tracking" },
    { id: "p5", prompt: "How to measure citation rate in Perplexity?" },
    { id: "p6", prompt: "Best software to monitor Gemini brand mentions" },
  ],
  platforms: ["chatgpt", "perplexity", "gemini"],
  rows: [], // empty until first dated test; component will show "Research coming soon"
  testDate: null,
  methodologyVersion: "v0.1",
  evidenceHref: "/ai-visibility",
  limitations: "Mention and citation are different metrics. A mention does not automatically mean a citation.",
};
