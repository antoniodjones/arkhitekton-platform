import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const architectureElements = pgTable("architecture_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'structural', 'behavioral', 'motivational', 'passive'
  category: text("category").notNull(), // 'business', 'application', 'data', 'technology'
  framework: text("framework").notNull().default('archimate'), // 'archimate', 'togaf', 'bpmn'
  description: text("description").notNull(),
  usageGuidelines: text("usage_guidelines"),
  iconName: text("icon_name"),
  color: text("color").notNull(),
  shape: text("shape").notNull(), // 'rectangular', 'rounded', 'diamond'
  relationships: jsonb("relationships").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recentElements = pgTable("recent_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  elementId: varchar("element_id").notNull(),
  usedAt: timestamp("used_at").defaultNow(),
  usageCount: integer("usage_count").default(1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArchitectureElementSchema = createInsertSchema(architectureElements).omit({
  id: true,
  createdAt: true,
});

export const insertRecentElementSchema = createInsertSchema(recentElements).omit({
  id: true,
  usedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ArchitectureElement = typeof architectureElements.$inferSelect;
export type InsertArchitectureElement = z.infer<typeof insertArchitectureElementSchema>;
export type RecentElement = typeof recentElements.$inferSelect;
export type InsertRecentElement = z.infer<typeof insertRecentElementSchema>;
