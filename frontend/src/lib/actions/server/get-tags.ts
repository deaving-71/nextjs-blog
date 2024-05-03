import { fetcher } from "@/lib/fetcher"
import { getTagsValidator } from "@/lib/validator/tags"

export async function getTags() {
  const response = await fetcher("/tags", {
    next: { revalidate: 1000 * 60 * 5 },
  })
  return getTagsValidator.parse(response)
}
