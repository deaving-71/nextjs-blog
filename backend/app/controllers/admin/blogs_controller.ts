import db from "#database/client";
import {
  blogsTable,
  blogsToTags,
  getArticlesTags,
  getBlogPostsCount,
  getBlogs,
} from "#schemas/blogs";
import { tagsTable } from "#schemas/tags";
import { removeImage, uploadImage } from "#services/cloudinary";
import { bufferToDataUri } from "#util/buffer-to-base64";
import { getSelectedRows } from "#util/get_selected_rows";
import { requestHandler } from "#util/request_handler";
import { slugify } from "#util/slugify";
import { uuid } from "#util/uuid";
import {
  createBlogValidator,
  destroyBlogValidator,
  indexBlogValidator,
  showBlogValidator,
  updateBlogValidator,
} from "#validators/admin/blogs";
import { eq } from "drizzle-orm";
import { DateTime } from "luxon";

export const index = requestHandler(async (req, res) => {
  const filters = indexBlogValidator.parse(req.query);

  const page = filters.page ? Number(filters.page) : 1;
  const limit = filters.limit ? Number(filters.limit) : 10;

  const offset = (page - 1) * limit;

  const blogs = await getBlogs({
    ...filters,
    offset,
    limit,
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
    search: filters.search,
    status: filters.status,
    tag: filters.tag,
  });

  const rowsSelected = getSelectedRows({ count, limit, page });

  const totalPages = Math.ceil(count / limit);
  const canNextPage = totalPages !== page;
  const canPrevPage = offset > 0;

  res.json({
    posts: blogs,
    canNextPage,
    canPrevPage,
    currentPage: page,
    totalPages,
    totalRows: count,
    rowsSelected,
  });
});

export const show = requestHandler(async (req, res) => {
  const { id } = showBlogValidator.parse(req.params);

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
    .where(eq(blogsTable.id, id));

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

export const create = requestHandler(async (req, res) => {
  const requestBody = {
    ...req.body,
    tags: req.body.tags?.split(","),
    thumbnail: req.file,
  };

  const { title, slug, thumbnail, content, tags, status, publishedAt } =
    await createBlogValidator.parseAsync(requestBody);

  const blogId = uuid();

  const dataURI = bufferToDataUri(thumbnail.buffer, thumbnail.mimetype);
  const thumbnailUrl = await uploadImage(dataURI);

  const blog = await db.transaction(async (tx) => {
    const [blog] = await tx
      .insert(blogsTable)
      .values({
        id: blogId,
        title,
        slug: slugify(slug),
        thumbnail: thumbnailUrl,
        content,
        status,
        publishedAt: DateTime.fromISO(publishedAt).toJSDate(),
      })
      .returning({ id: blogsTable.id });

    const pivotRows = tags.map((tagId) => ({
      blogId: blogId,
      tagId: tagId,
    }));

    await tx.insert(blogsToTags).values(pivotRows);
    return blog;
  });

  res.json({ id: blog.id });
});

//? Only dirty fields are sent
export const update = requestHandler(async (req, res) => {
  const request = {
    params: req.params,
    thumbnail: req.file,
    ...req.body,
    tags: req.body.tags?.split(","),
  };

  const { params, tags, thumbnail, ...values } =
    await updateBlogValidator.parseAsync(request);

  if (!Object.keys(values).length && !tags && !thumbnail) {
    return res.end();
  }

  let thumbnailUrl: string | undefined = undefined;

  const [blog] = await db
    .select({ thumbnail: blogsTable.thumbnail })
    .from(blogsTable)
    .where(eq(blogsTable.id, params.id));

  if (thumbnail) {
    const dataURI = bufferToDataUri(thumbnail.buffer, thumbnail.mimetype);
    await removeImage(blog.thumbnail);
    thumbnailUrl = await uploadImage(dataURI);
  }

  const publishedAt: Date | undefined = values.publishedAt
    ? DateTime.fromISO(values.publishedAt).toJSDate()
    : undefined;

  if (values.slug) {
    values["slug"] = slugify(values.slug);
  }

  await db.transaction(async (tx) => {
    const [blog] = await tx
      .update(blogsTable)
      .set({
        ...values,
        publishedAt,
        thumbnail: thumbnailUrl,
        updatedAt: DateTime.local().toJSDate(),
      })
      .where(eq(blogsTable.id, params.id))
      .returning({ id: blogsTable.id, slug: blogsTable.slug });

    if (tags) {
      const pivotRows = tags.map((tagId) => ({
        blogId: blog.id,
        tagId: tagId,
      }));

      await tx.delete(blogsToTags).where(eq(blogsToTags.blogId, blog.id));
      await tx.insert(blogsToTags).values(pivotRows);
    }
  });

  res.end();
});

export const destroy = requestHandler(async (req, res) => {
  const { id } = destroyBlogValidator.parse(req.params);

  const [blog] = await db
    .select({ thumbnail: blogsTable.thumbnail })
    .from(blogsTable)
    .where(eq(blogsTable.id, id));

  await removeImage(blog.thumbnail);
  await db.delete(blogsTable).where(eq(blogsTable.id, id));

  res.end();
});
