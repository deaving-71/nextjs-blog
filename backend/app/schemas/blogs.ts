import {
  index,
  pgEnum,
  PgSelect,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { tagsTable } from "#schemas/tags";
import {
  and,
  countDistinct,
  desc,
  eq,
  ilike,
  inArray,
  relations,
} from "drizzle-orm";
import db from "#database/client";
import { stripHtml } from "string-strip-html";

export const statusEnum = pgEnum("status", ["draft", "published"]);

export const blogsTable = pgTable(
  "blogs",
  {
    id: uuid("id").primaryKey(),
    title: varchar("title").notNull(),
    slug: varchar("slug").unique().notNull(),
    thumbnail: varchar("thumbnail").notNull(),
    content: text("content").notNull(),
    status: statusEnum("status").default("draft"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    slugIdx: index("blog_slug_idx").on(table.slug),
  })
);

export const blogsRelations = relations(blogsTable, ({ many }) => ({
  blogsToTags: many(blogsToTags),
}));

export const blogsToTags = pgTable(
  "blogs_to_tags",
  {
    blogId: uuid("blog_id")
      .notNull()
      .references(() => blogsTable.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.blogId, t.tagId] }),
  })
);

export const blogsToTagsRelations = relations(blogsToTags, ({ one }) => ({
  blog: one(blogsTable, {
    fields: [blogsToTags.blogId],
    references: [blogsTable.id],
  }),
  tag: one(tagsTable, {
    fields: [blogsToTags.tagId],
    references: [tagsTable.id],
  }),
}));

export type GetBlogsFilters = {
  tag?: string;
  status?: "published" | "draft";
  search?: string;
};

export type GetBlogsOptions = GetBlogsFilters & {
  limit: number;
  offset: number;
  withContent?: boolean;
  withThumbnail?: boolean;
};

export async function getBlogs({
  search,
  status,
  tag,
  limit,
  offset,
  withContent,
  withThumbnail,
}: GetBlogsOptions) {
  const blogs = await db
    .select({
      id: blogsTable.id,
      title: blogsTable.title,
      slug: blogsTable.slug,
      status: blogsTable.status,
      publishedAt: blogsTable.publishedAt,
      ...(withContent ? { content: blogsTable.content } : {}),
      ...(withThumbnail ? { thumbnail: blogsTable.thumbnail } : {}),
    })
    .from(blogsToTags)
    .innerJoin(blogsTable, eq(blogsToTags.blogId, blogsTable.id))
    .innerJoin(tagsTable, eq(blogsToTags.tagId, tagsTable.id))
    .where(
      and(
        tag ? eq(tagsTable.slug, tag) : undefined,
        status ? eq(blogsTable.status, status) : undefined,
        search ? ilike(blogsTable.title, `%${search}%`) : undefined
      )
    )
    .limit(limit)
    .offset(offset)
    .orderBy(desc(blogsTable.publishedAt))
    .groupBy(
      blogsTable.id,
      blogsTable.title,
      blogsTable.slug,
      blogsTable.content,
      blogsTable.publishedAt
    );

  if (blogs.length < 0) return blogs;

  const articlesIds = blogs.map((blog) => blog.id);
  const articlesTags = await getArticlesTags(articlesIds);

  const formattedBlogs = blogs.map((blog) => {
    const tags: Omit<(typeof articlesTags)[0], "blogId">[] = [];
    articlesTags.forEach((currentTag) => {
      if (currentTag.blogId === blog.id) {
        tags.push({
          id: currentTag.id,
          slug: currentTag.slug,
          name: currentTag.name,
        });
      }
    });

    let previewContent;
    if (blog.content)
      previewContent = stripHtml(blog.content).result.substring(0, 200);

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      ...(withContent ? { previewContent } : {}),
      ...(withThumbnail ? { thumbnail: blog.thumbnail } : {}),
      status: blog.status,
      publishedAt: blog.publishedAt,
      tags,
    };
  });

  return formattedBlogs;
}

export async function getArticlesTags(articlesIds: string[]) {
  return db
    .select({
      blogId: blogsTable.id,
      id: tagsTable.id,
      name: tagsTable.name,
      slug: tagsTable.slug,
    })
    .from(blogsToTags)
    .innerJoin(blogsTable, eq(blogsToTags.blogId, blogsTable.id))
    .innerJoin(tagsTable, eq(blogsToTags.tagId, tagsTable.id))
    .where(inArray(blogsTable.id, articlesIds));
}

export async function getBlogPostsCount({
  search,
  status,
  tag,
}: GetBlogsFilters) {
  return db
    .select({ count: countDistinct(blogsTable.id) })
    .from(blogsToTags)
    .innerJoin(blogsTable, eq(blogsToTags.blogId, blogsTable.id))
    .innerJoin(tagsTable, eq(blogsToTags.tagId, tagsTable.id))
    .where(
      and(
        tag ? eq(tagsTable.slug, tag) : undefined,
        status ? eq(blogsTable.status, status) : undefined,
        search ? ilike(blogsTable.title, `%${search}%`) : undefined
      )
    );
}
