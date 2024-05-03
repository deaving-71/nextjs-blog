import db from "#database/client";
import { blogsTable } from "#schemas/blogs";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

export const indexBlogValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const showBlogValidator = z.object({
  id: z.string().uuid(),
});

export const multerFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number(),
});

export const createBlogValidator = z
  .object({
    title: z.string().min(1, { message: "Title cannot be empty" }),
    slug: z.string().min(1, { message: "Slug cannot be empty" }),
    thumbnail: multerFileSchema,
    content: z.string().min(1, { message: "Content cannot be empty" }),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z.string().min(1, { message: "You must pick a publish date" }),
    tags: z
      .array(z.string(), { required_error: "You must at least add one tag" })
      .min(1, { message: "You must at least add one tag" }),
  })
  .refine(
    async (data) => {
      const [blog] = await db
        .select()
        .from(blogsTable)
        .where(eq(blogsTable.slug, data.slug));

      return !blog;
    },
    { message: "Blog slug must be unique", path: ["slug"] }
  );

export const updateBlogValidator = z
  .object({
    params: z.object({
      id: z.string().uuid(),
    }),

    title: z.string().min(1, { message: "Title cannot be empty" }).optional(),
    slug: z.string().min(1, { message: "Slug cannot be empty" }).optional(),
    thumbnail: multerFileSchema.optional(),
    content: z
      .string()
      .min(1, { message: "Content cannot be empty" })
      .optional(),
    status: z.enum(["draft", "published"]).optional(),
    publishedAt: z.string().optional(),
    tags: z
      .array(z.string())
      .min(1, { message: "You must at least add one tag" })
      .optional(),
  })
  .refine(
    async (data) => {
      if (!data.slug) return true;

      const [blog] = await db
        .select()
        .from(blogsTable)
        .where(
          and(eq(blogsTable.slug, data.slug), ne(blogsTable.id, data.params.id))
        );
      return !blog;
    },
    { message: "Slug must be unique", path: ["slug"] }
  );

export const destroyBlogValidator = z.object({
  id: z.string().uuid(),
});
