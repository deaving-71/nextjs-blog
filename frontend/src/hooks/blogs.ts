import {
  MutationOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { z } from "zod"

import { fetcher } from "@/lib/fetcher"
import { blogSchema, getBlogsValidator } from "@/lib/validator/blogs"

import { useBlogPostsSearchParams } from "./useBlogPostsSearchParams"

const mutationResponse = z.object({ id: z.string() })
const getAllBlogsValidator = getBlogsValidator.omit({ posts: true }).extend({
  posts: z.array(blogSchema.omit({ thumbnail: true, content: true })),
})

export function useGetAllBlogPostsQuery(opts?: {
  limit?: number
  status?: "published" | "draft"
}) {
  const params = useBlogPostsSearchParams()
  const searchParams = new URLSearchParams()

  params?.page && searchParams.set("page", params.page.toString())
  params?.tag && searchParams.set("tag", params.tag)
  params?.status && searchParams.set("status", params.status)
  params?.search && searchParams.set("search", params.search)

  if (opts?.limit) {
    searchParams.set("limit", opts.limit.toString())
  } else if (params.limit) {
    searchParams.set("limit", params.limit.toString())
  }

  return useSuspenseQuery({
    queryKey: ["blogs", { ...params }],
    queryFn: async () => {
      const result = await fetcher(`/admin/blogs?${searchParams.toString()}`)
      return getAllBlogsValidator.parse(result)
    },
  })
}

export function useGetBlogPostQuery(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const result = await fetcher(`/admin/blogs/${id}`)
      return blogSchema.parse(result)
    },
    retry: 2,
    enabled: !!id,
  })
}

export function useGetImageFile(
  url?: string,
  opts?: {
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: ["image", url],
    queryFn: async () => {
      if (!url) return null
      const result = await fetch(url)
      const blob = await result.blob()
      const image = new File([blob], url, { type: blob.type })
      return image
    },
    ...opts,
  })
}

export function useCreateBlogPost(
  opts?: MutationOptions<z.infer<typeof mutationResponse>, Error, FormData>
) {
  return useMutation({
    mutationKey: ["blog", "create"],
    mutationFn: async (data) => {
      const result = await fetcher("/admin/blogs", {
        method: "POST",
        body: data,
      })
      return mutationResponse.parse(result)
    },
    ...opts,
  })
}

export function useUpdateBlogPost(
  opts?: MutationOptions<void, Error, { id: string; data: FormData }>
) {
  return useMutation({
    mutationKey: ["blog", "update"],
    mutationFn: async ({ id, data }) => {
      await fetcher(`/admin/blogs/${id}`, {
        method: "PUT",
        body: data,
      })
    },
    ...opts,
  })
}

export function useDeleteBlogPost(
  id: string | null,
  opts?: MutationOptions<void, Error, void>
) {
  return useMutation({
    mutationKey: ["blog", "delete"],
    mutationFn: async () => {
      await fetcher(`/admin/blogs/${id}`, {
        method: "DELETE",
      })
    },
    ...opts,
  })
}
