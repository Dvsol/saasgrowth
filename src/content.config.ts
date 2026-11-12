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
    pricingCheckedAt: z.string().optional(),
    productStatus: z.enum(["active", "discontinued", "beta"]).optional(),
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

const scorecards = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/scorecards" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    department: z.string(),
    productIds: z.array(z.string()),
    taskDefinitions: z.array(z.string()),
    results: z.array(z.any()).optional(),
    verdicts: z.array(z.any()).optional(),
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

const visibilitySnapshots = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/visibilitySnapshots" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    testedBrand: z.string(),
    category: z.string().optional(),
    prompts: z.array(z.string()),
    platforms: z.array(z.enum(["chatgpt", "perplexity", "gemini"])),
    runsPerPrompt: z.number().optional(),
    results: z.array(z.any()).optional(),
    testDate: z.coerce.date().optional(),
    methodologyVersion: z.string().optional(),
    limitations: z.string().optional(),
    testStatus: z.enum(["planned", "in_progress", "completed", "prototype"]).optional(),
    evidence: z.array(z.string()).optional(),
    disclosure: z.string().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    department: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    relatedProducts: z.array(z.string()).optional(),
    relatedTests: z.array(z.string()).optional(),
    relatedVideos: z.array(z.string()).optional(),
    disclosures: z.string().optional(),
    methodologyVersion: z.string().optional(),
    limitations: z.string().optional(),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/videos" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    videoUrl: z.url().optional(),
    publishedAt: z.coerce.date().optional(),
    relatedArticles: z.array(z.string()).optional(),
    relatedProducts: z.array(z.string()).optional(),
  }),
});

export const collections = { departments, products, tests, scorecards, visibilitySnapshots, articles, videos };
