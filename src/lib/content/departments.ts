/**
 * Departments — structured content, separate from presentation (spec §8)
 * Never fabricate counts. publishedCount is null until real research exists.
 */
export type Department = {
  id: string;
  number: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  status: "active" | "future";
  order: number;
  publishedCount: number | null;
};

export const departments: Department[] = [
  {
    id: "ai-visibility",
    number: "01",
    slug: "ai-visibility",
    title: "AI Search Visibility",
    description: "Where AI platforms mention your brand — prompts, citations, dated snapshots.",
    href: "/ai-visibility",
    status: "active",
    order: 1,
    publishedCount: null,
  },
  {
    id: "seo-content",
    number: "02",
    slug: "seo-content",
    title: "SEO & Content",
    description: "Content systems that help SaaS teams publish, optimize and rank.",
    href: "/scorecards",
    status: "future",
    order: 2,
    publishedCount: null,
  },
  {
    id: "email-lifecycle",
    number: "03",
    slug: "email-lifecycle",
    title: "Email & Lifecycle",
    description: "Email, onboarding and lifecycle tools for product-led growth.",
    href: "/scorecards",
    status: "future",
    order: 3,
    publishedCount: null,
  },
  {
    id: "analytics-reporting",
    number: "04",
    slug: "analytics-reporting",
    title: "Analytics & Reporting",
    description: "Product and marketing analytics for bootstrapped teams.",
    href: "/scorecards",
    status: "future",
    order: 4,
    publishedCount: null,
  },
  {
    id: "reviews-social",
    number: "05",
    slug: "reviews-social",
    title: "Reviews & Social Proof",
    description: "Review collection and proof systems that build trust.",
    href: "/scorecards",
    status: "future",
    order: 5,
    publishedCount: null,
  },
  {
    id: "sales-crm",
    number: "06",
    slug: "sales-crm",
    title: "Sales & CRM",
    description: "CRM and sales pipeline tools for founder-led sales.",
    href: "/scorecards",
    status: "future",
    order: 6,
    publishedCount: null,
  },
];
