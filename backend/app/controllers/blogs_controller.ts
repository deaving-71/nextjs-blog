import db from "#database/client";
import {
  blogsTable,
  blogsToTags,
  getArticlesTags,
  getBlogPostsCount,
  getBlogs,
} from "#schemas/blogs";
import { tagsTable } from "#schemas/tags";
import { requestHandler } from "#util/request_handler";
import { indexBlogValidator, showBlogValidator } from "#validators/blogs";
import { eq, inArray } from "drizzle-orm";
import { stripHtml } from "string-strip-html";

export const index = requestHandler(async (req, res) => {
  const filters = indexBlogValidator.parse(req.query);

  const page = filters.page ? Number(filters.page) : 1;
  const limit = filters.limit ? Number(filters.limit) : 10;

  const offset = (page - 1) * limit;

  const blogs = await getBlogs({
    ...filters,
    offset,
    limit,
    status: "published",
    withContent: true,
    withThumbnail: true,
  });

  if (blogs.length <= 0) {
    return res.json({
      posts: [],
      canNextPage: false,
      canPrevPage: false,
      currentPage: page,
      totalPages: 1,
      totalRows: 0,
      rowsSelected: 0,
    });
  }

  const [{ count }] = await getBlogPostsCount({
    ...filters,
    status: "published",
  });

  const totalPages = Math.ceil(count / limit);
  const canNextPage = totalPages !== page;
  const canPrevPage = offset > 0;

  res.json({
    posts: blogs,
    canNextPage,
    canPrevPage,
    currentPage: page,
    totalPages: totalPages,
  });
});

export const show = requestHandler(async (req, res) => {
  const { slug } = showBlogValidator.parse(req.params);

  const result = await db
    .select({
      id: blogsTable.id,
      title: blogsTable.title,
      slug: blogsTable.slug,
      thumbnail: blogsTable.thumbnail,
      content: blogsTable.content,
      status: blogsTable.status,
      publishedAt: blogsTable.publishedAt,
      tag: {
        id: tagsTable.id,
        name: tagsTable.name,
        slug: tagsTable.slug,
      },
    })
    .from(blogsToTags)
    .innerJoin(blogsTable, eq(blogsToTags.blogId, blogsTable.id))
    .innerJoin(tagsTable, eq(blogsToTags.tagId, tagsTable.id))
    .where(eq(blogsTable.slug, slug));

  const blog = {
    id: result[0].id,
    title: result[0].title,
    slug: result[0].slug,
    thumbnail: result[0].thumbnail,
    status: result[0].status,
    content: result[0].content,
    publishedAt: result[0].publishedAt,
  };

  const tags = result.map((post) => ({
    id: post.tag.id,
    name: post.tag.name,
    slug: post.tag.slug,
  }));

  res.json({ ...blog, tags });
});
