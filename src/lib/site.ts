/** Central brand/nav config — easy to rebrand per spec 1. */
export const siteConfig = {
  brand: {
    name: "EKIS",
    tagline: "Independent tests of the tools SaaS founders use to grow.",
    supporting: "Same tasks, same sample data, scored and dated.",
    disclosure: "Payment never changes an independent score.",
  },
  nav: [
    { label: "Scorecards", href: "/scorecards" },
    { label: "AI Visibility", href: "/ai-visibility" },
    { label: "Method", href: "/method" },
    { label: "Work with me", href: "/work-with-me" },
  ],
  footer: {
    primary: [
      { label: "About", href: "/about" },
      { label: "Scorecards", href: "/scorecards" },
      { label: "AI Visibility", href: "/ai-visibility" },
      { label: "Method", href: "/method" },
      { label: "Independence and disclosure", href: "/independence" },
      { label: "Work with me", href: "/work-with-me" },
      { label: "Contact", href: "/contact" },
    ],
  },
} as const;
