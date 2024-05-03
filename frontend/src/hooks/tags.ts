import { NewTag } from "@/types"
import {
  MutationOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import { getTagsValidator, tagSchema } from "@/lib/validator/tags"

export function useGetTagsQuery() {
  return useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const result = await fetcher("/tags")
      return getTagsValidator.parse(result)
    },
    staleTime: 1000 * 60 * 15,
  })
}

export function useGetTagQuery(id: string | null) {
  return useSuspenseQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      const result = await fetcher(`/admin/tags/${id}`)
      return tagSchema.parse(result)
    },
    staleTime: 1000 * 60 * 15,
  })
}

export function useCreateTag(opts?: MutationOptions<void, Error, NewTag>) {
  return useMutation({
    mutationKey: ["tag", "create"],
    mutationFn: async (data) => {
      await fetcher("/admin/tags/", {
        method: "POST",
        body: data,
      })
    },
    ...opts,
  })
}

export function useUpdateTag(
  opts?: MutationOptions<void, Error, { id: string; data: Partial<NewTag> }>
) {
  return useMutation({
    mutationKey: ["tag", "create"],
    mutationFn: async ({ id, data }) => {
      await fetcher(`/admin/tags/${id}`, {
        method: "PUT",
        body: data,
      })
    },
    ...opts,
  })
}

export function useDeleteTag(
  id: string | null,
  opts?: MutationOptions<void, Error, void>
) {
  return useMutation({
    mutationKey: ["tag", "delete"],
    mutationFn: async () => {
      await fetcher(`/admin/tags/${id}`, {
        method: "DELETE",
      })
    },
    ...opts,
  })
}
