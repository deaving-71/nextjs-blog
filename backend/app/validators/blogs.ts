import { z } from "zod";

export const indexBlogValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  tag: z.string().optional(),
});

export const showBlogValidator = z.object({
  slug: z.string(),
});
