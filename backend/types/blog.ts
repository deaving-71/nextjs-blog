import { blogsTable, blogsToTags } from "#schemas/blogs";

export type Blog = typeof blogsTable.$inferSelect;
export type NewBlog = typeof blogsTable.$inferInsert;

export type BlogToTag = typeof blogsToTags.$inferSelect;
export type NewBlogToTag = typeof blogsToTags.$inferInsert;
