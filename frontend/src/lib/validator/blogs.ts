import { z } from "zod"

import { tagSchema } from "./tags"

export const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  thumbnail: z.string(),
  content: z.string(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string(),
  tags: z.array(tagSchema),
})

export const getBlogsValidator = z.object({
  posts: z.array(
    blogSchema.omit({ content: true }).extend({ previewContent: z.string() })
  ),
  totalPages: z.number(),
  currentPage: z.number(),
  canNextPage: z.boolean(),
  canPrevPage: z.boolean(),
  totalRows: z.number(),
  rowsSelected: z.number(),
})

export const createBlogValidator = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  slug: z.string().min(1, { message: "Slug cannot be empty" }),
  thumbnail: z
    .custom<File>()
    .refine((file) => !file || (!!file && file.size > 0), {
      message: "Please add an image first",
    })
    .refine((file) => !file || (!!file && file.size <= 8 * 1024 * 1024), {
      message: "The blog post thumbnail must be a maximum of 8MB",
    })
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed",
    }),
  content: z.string().min(1, { message: "Content cannot be empty" }),
  publishedAt: z.string().min(1, { message: "Please pick a publishing date" }),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z
    .array(z.string(), { required_error: "You must at least add one tag" })
    .min(1, { message: "You must at least add one tag" }),
})

export const updateBlogValidator = createBlogValidator.partial()
