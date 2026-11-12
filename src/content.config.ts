import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const departments = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/departments" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.enum(["active", "future", "archived"]),
    order: z.number(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    website: z.url().optional(),
    category: z.string(),
    description: z.string(),
    targetAudience: z.string().optional(),
    pricing: z.string().optional(),
    pricingCheckedAt: z.coerce.date().optional(),
    productStatus: z.enum(["active", "discontinued", "beta"]).optional(),
    testStatus: z.enum(["planned", "in_progress", "completed", "prototype"]).optional(),
    disclosure: z.string().optional(),
    limitations: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const tests = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tests" }),
  schema: z.object({
    id: z.string(),
    productId: z.string().optional(),
    testType: z.string(),
    testDate: z.coerce.date(),
    testStatus: z.enum(["planned", "in_progress", "completed", "prototype"]),
    environment: z.string().optional(),
    settings: z.string().optional(),
    evidence: z.array(z.string()).optional(),
    findings: z.string().optional(),
    methodology: z.string().optional(),
    methodologyVersion: z.string().optional(),
    limitations: z.string().optional(),
    disclosure: z.string().optional(),
  }),
});

// Explicit schemas for scorecards — match rendering requirements
const scorecardOutcome = z.enum(["pass", "fail", "partial", "pending", "not_tested", "not_applicable"]);
const scorecardVerdictValue = z.enum([
  "pass",
  "fail",
  "partial",
  "pending",
  "recommended",
  "not_recommended",
  "not_tested",
  "needs_review",
]);

const scorecardResult = z.object({
  taskId: z.string().min(1),
  productId: z.string().min(1),
  outcome: scorecardOutcome,
  evidence: z.union([z.url(), z.literal("")]).optional(),
  note: z.string().optional(),
});

const scorecardVerdict = z.object({
  productId: z.string().min(1),
  verdict: scorecardVerdictValue,
  summary: z.string().optional(),
  evidence: z.union([z.url(), z.literal("")]).optional(),
});

const scorecards = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/scorecards" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    department: z.string(),
    productIds: z.array(z.string()),
    taskDefinitions: z.array(z.string()),
    results: z.array(scorecardResult).optional(),
    verdicts: z.array(scorecardVerdict).optional(),
    methodology: z.string().optional(),
    methodologyVersion: z.string().optional(),
    testDate: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    testStatus: z.enum(["planned", "in_progress", "completed", "prototype"]).optional(),
    disclosure: z.string().optional(),
    limitations: z.string().optional(),
    evidence: z.array(z.string()).optional(),
  }),
});

// Explicit schemas for AI visibility — enforce platforms and Y/N/C/U
const platformEnum = z.enum(["chatgpt", "perplexity", "gemini"]);
const cellStateEnum = z.enum(["Y", "N", "C", "U"]);

const visibilityResult = z.object({
  promptId: z.string().min(1),
  results: z.record(platformEnum, cellStateEnum),
});

const visibilitySnapshots = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/visibilitySnapshots" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    testedBrand: z.string(),
    category: z.string().optional(),
    prompts: z.array(z.string()),
    platforms: z.array(platformEnum),
    runsPerPrompt: z.number().optional(),
    results: z.array(visibilityResult).optional(),
    testDate: z.coerce.date().optional(),
    methodologyVersion: z.string().optional(),
    limitations: z.string().optional(),
    testStatus: z.enum(["planned", "in_progress", "completed", "prototype"]).optional(),
    evidence: z.array(z.string()).optional(),
    disclosure: z.string().optional(),
  }),
});

// Reserved for future milestones — not exported to avoid empty-collection warnings without inventing content
// const articles = defineCollection({...})
// const videos = defineCollection({...})

export const collections = { departments, products, tests, scorecards, visibilitySnapshots };
