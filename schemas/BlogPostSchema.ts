import { z } from "zod";

// Content block schemas for structured content
const cardBlockSchema = z.object({
  id: z.string(),
  type: z.literal("card"),
  order: z.number(),
  variant: z.enum(["feature", "tip", "alert", "info"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  icon: z.string().optional(),
  color: z
    .enum(["purple", "blue", "green", "yellow", "red", "gray"])
    .optional(),
  solution: z.string().optional(), // Solution field for warning/alert cards
  link: z
    .object({
      text: z.string(),
      url: z.string().url("Invalid URL"),
    })
    .optional(),
});

const stepBlockSchema = z.object({
  id: z.string(),
  type: z.literal("step"),
  order: z.number(),
  stepNumber: z.number().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  details: z.array(z.string()).min(1, "At least one detail is required"),
  tips: z.array(z.string()).min(1, "At least one tip is required"),
  estimatedTime: z.string().optional(),
  icon: z.string().optional(),
});

const alertBlockSchema = z.object({
  id: z.string(),
  type: z.literal("alert"),
  order: z.number(),
  variant: z.enum(["info", "warning", "success", "error"]),
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  icon: z.string().optional(),
});

const tableBlockSchema = z.object({
  id: z.string(),
  type: z.literal("table"),
  order: z.number(),
  title: z.string().optional(),
  headers: z.array(z.string()).min(1, "At least one header is required"),
  rows: z.array(z.array(z.string())).min(1, "At least one row is required"),
  variant: z.enum(["simple", "striped", "bordered"]).optional(),
  caption: z.string().optional(),
});

const featureGridBlockSchema = z.object({
  id: z.string(),
  type: z.literal("feature-grid"),
  order: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1, "Feature title is required"),
        description: z.string().min(1, "Feature description is required"),
        icon: z.string().optional(),
        color: z
          .enum(["purple", "blue", "green", "yellow", "red", "gray"])
          .optional(),
        importance: z.enum(["Critical", "High", "Medium", "Low"]).optional(),
        tips: z.array(z.string()).optional(),
      })
    )
    .min(1, "At least one feature is required"),
  columns: z.enum(["2", "3", "4"]).optional(),
  variant: z.enum(["simple", "detailed"]).optional(),
});

const twoColumnBlockSchema = z.object({
  id: z.string(),
  type: z.literal("two-column"),
  order: z.number(),
  leftContent: z.string().min(1, "Left content is required"),
  rightContent: z.string().min(1, "Right content is required"),
  leftTitle: z.string().optional(),
  rightTitle: z.string().optional(),
  leftIcon: z.string().optional(),
  rightIcon: z.string().optional(),
});

const comparisonTableBlockSchema = z.object({
  id: z.string(),
  type: z.literal("comparison-table"),
  order: z.number(),
  title: z.string().optional(),
  headers: z.array(z.string()).min(1, "At least one header is required"),
  rows: z
    .array(
      z.object({
        feature: z.string().min(1, "Feature name is required"),
        values: z.array(z.string()).min(1, "At least one value is required"),
      })
    )
    .min(1, "At least one row is required"),
  highlightColumn: z.number().optional(),
});

const requirementsBlockSchema = z.object({
  id: z.string(),
  type: z.literal("requirements"),
  order: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  requirements: z
    .array(
      z.object({
        title: z.string().min(1, "Requirement title is required"),
        description: z.string().min(1, "Requirement description is required"),
        icon: z.string().min(1, "Icon is required"),
      })
    )
    .min(1, "At least one requirement is required"),
  columns: z.enum(["1", "2", "3"]),
  variant: z.enum(["cards", "list"]),
});

// Union type for all content blocks
const contentBlockSchema = z.discriminatedUnion("type", [
  cardBlockSchema,
  stepBlockSchema,
  alertBlockSchema,
  tableBlockSchema,
  featureGridBlockSchema,
  twoColumnBlockSchema,
  comparisonTableBlockSchema,
  requirementsBlockSchema,
]);

// Schema for creating a new blog post
export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .transform((val) => val.trim()),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .transform((val) => val.trim()),

  content: z
    .string()
    .min(1, "Content is required")
    .transform((val) => val.trim()),

  // Structured content blocks
  contentBlocks: z.array(contentBlockSchema).optional().default([]),

  catSlug: z.string().min(1, "Category is required"),

  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),

  isPrivate: z.boolean().default(false),

  // Optional fields
  img: z.string().url("Invalid image URL").optional().nullable(),

  readTime: z
    .number()
    .min(1, "Read time must be at least 1 minute")
    .optional()
    .nullable(),

  // SEO fields
  metaTitle: z
    .string()
    .max(60, "Meta title must be less than 60 characters")
    .optional()
    .nullable(),

  metaDescription: z
    .string()
    .max(160, "Meta description must be less than 160 characters")
    .optional()
    .nullable(),

  keywords: z
    .array(z.string())
    .max(10, "Maximum 10 keywords allowed")
    .optional()
    .default([]),

  canonicalUrl: z.string().url("Invalid canonical URL").optional().nullable(),

  ogImage: z.string().url("Invalid Open Graph image URL").optional().nullable(),

  ogTitle: z
    .string()
    .max(90, "Open Graph title must be less than 90 characters")
    .optional()
    .nullable(),

  ogDescription: z
    .string()
    .max(200, "Open Graph description must be less than 200 characters")
    .optional()
    .nullable(),

  // Schema.org structured data
  authorUrl: z.string().url("Invalid author URL").optional().nullable(),

  // Additional metadata
  tags: z
    .array(z.string())
    .max(20, "Maximum 20 tags allowed")
    .optional()
    .default([]),

  featured: z.boolean().default(false),

  allowComments: z.boolean().default(true),
});

// Schema for updating an existing blog post
export const updateBlogPostSchema = createBlogPostSchema.partial();

// Schema for blog post query parameters
export const blogPostQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  featured: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["publishedAt", "views", "title"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type inference
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogPostQueryInput = z.infer<typeof blogPostQuerySchema>;
