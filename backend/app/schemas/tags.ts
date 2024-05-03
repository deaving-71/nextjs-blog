import { relations } from "drizzle-orm";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { blogsToTags } from "#schemas/blogs";

export const tagsTable = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    slugIdx: index("tag_slug_idx").on(table.slug),
  })
);

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  blogsToTags: many(blogsToTags),
}));
