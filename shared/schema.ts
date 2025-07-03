import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productAnalyses = pgTable("product_analyses", {
  id: serial("id").primaryKey(),
  imageData: text("image_data").notNull(), // base64 encoded image
  title: text("title").notNull(),
  description: text("description").notNull(),
  hashtags: jsonb("hashtags").$type<string[]>().notNull(),
  categories: jsonb("categories").$type<string[]>().notNull(),
  settings: jsonb("settings").$type<{
    descriptionLength: 'short' | 'medium' | 'long';
    targetPlatforms: string[];
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductAnalysisSchema = createInsertSchema(productAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertProductAnalysis = z.infer<typeof insertProductAnalysisSchema>;
export type ProductAnalysis = typeof productAnalyses.$inferSelect;

// API request/response schemas
export const generateContentRequestSchema = z.object({
  imageData: z.string().min(1, "تصویر الزامی است"),
  settings: z.object({
    descriptionLength: z.enum(['short', 'medium', 'long']).default('medium'),
    targetPlatforms: z.array(z.string()).default(['store', 'instagram']),
  }),
});

export const generateContentResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  hashtags: z.array(z.string()),
  categories: z.array(z.string()),
});

export type GenerateContentRequest = z.infer<typeof generateContentRequestSchema>;
export type GenerateContentResponse = z.infer<typeof generateContentResponseSchema>;
