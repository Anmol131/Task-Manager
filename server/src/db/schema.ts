import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default('todo'),
    createdAt: timestamp("created_at").defaultNow(),
    deadline: timestamp("deadline"),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
