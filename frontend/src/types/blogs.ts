import { z } from "zod"

import { blogSchema, createBlogValidator } from "@/lib/validator/blogs"

export type Blog = z.infer<typeof blogSchema>
export type NewBlog = z.infer<typeof createBlogValidator>
