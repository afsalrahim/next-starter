import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

// ============================================================================
// USERS TABLE
// ============================================================================
export const users = pgTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(), // Clerk user ID
    email: varchar('email', { length: 255 }).unique(),
    name: varchar('name', { length: 255 }),
    avatar: varchar('avatar', { length: 500 }),
    role: varchar('role', { length: 50 }).notNull().default('viewer'), // admin | viewer | contributor
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;