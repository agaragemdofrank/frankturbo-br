import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Videos table for storing YouTube video links (public and private)
 * Private videos are only accessible to members
 */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  youtubeUrl: text("youtubeUrl").notNull(),
  youtubeId: varchar("youtubeId", { length: 64 }).notNull().unique(),
  description: text("description"),
  isPrivate: int("isPrivate").default(0).notNull(), // 0 = public, 1 = members only
  order: int("order").default(0).notNull(), // For sorting videos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Members table for tracking membership status
 * Links users to their membership tier and expiration
 */
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", ["basic", "premium", "vip"]).default("basic").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

/**
 * Video access logs for tracking member viewing patterns
 * Helps identify unauthorized access attempts
 */
export const videoAccessLogs = mysqlTable("videoAccessLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  videoId: int("videoId").notNull().references(() => videos.id, { onDelete: "cascade" }),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  wasSuccessful: int("wasSuccessful").default(1).notNull(), // 0 = blocked, 1 = allowed
  blockReason: varchar("blockReason", { length: 255 }), // e.g., "inspect_attempt", "copy_attempt"
});

export type VideoAccessLog = typeof videoAccessLogs.$inferSelect;
export type InsertVideoAccessLog = typeof videoAccessLogs.$inferInsert;