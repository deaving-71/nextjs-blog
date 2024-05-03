import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "#schemas/users";
import { relations } from "drizzle-orm";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
  })
);

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
