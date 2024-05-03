import db from "#database/client";
import { blogsTable, getBlogs } from "#schemas/blogs";
import { requestHandler } from "#util/request_handler";
import { count, eq } from "drizzle-orm";

export const index = requestHandler(async (_, res) => {
  const [publishedBlogs] = await db
    .select({ count: count() })
    .from(blogsTable)
    .where(eq(blogsTable.status, "published"));

  const [draftBlogs] = await db
    .select({ count: count() })
    .from(blogsTable)
    .where(eq(blogsTable.status, "draft"));

  const totalBlogPostsCount = publishedBlogs.count + draftBlogs.count;

  res.json({
    blogsCount: {
      total: totalBlogPostsCount,
      published: publishedBlogs.count,
      draft: draftBlogs.count,
    },
  });
});
