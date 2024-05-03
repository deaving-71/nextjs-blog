"use server"

import { fetcher } from "../../fetcher"
import { blogSchema } from "../../validator/blogs"

export async function getBlogPost(slug: string) {
  const result = await fetcher(`/blogs/${slug}`, {
    next: { revalidate: 1000 * 60 * 5 },
  })
  return blogSchema.parse(result)
}
