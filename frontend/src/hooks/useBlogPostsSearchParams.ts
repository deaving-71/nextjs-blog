import { useSearchParams } from "next/navigation"

export function useBlogPostsSearchParams() {
  const searchParams = useSearchParams()

  const tag = searchParams.get("tag")
  const page = searchParams.get("page")
  const limit = searchParams.get("limit")
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  return { tag, page, limit, status, search }
}
