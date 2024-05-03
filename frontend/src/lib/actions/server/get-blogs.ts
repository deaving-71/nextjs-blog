import { fetcher } from "@/lib/fetcher"
import { getBlogsValidator } from "@/lib/validator/blogs"

export async function getBlogs(opts?: {
  page?: number | string | null
  limit?: number | string | null
  tag?: string | null
}) {
  const searchParams = new URLSearchParams()

  opts?.page && searchParams.set("page", opts.page.toString())
  opts?.limit && searchParams.set("limit", opts.limit.toString())
  opts?.tag && searchParams.set("tag", opts.tag.toString())

  const params = searchParams.toString()

  const result = await fetcher(`/blogs?${params}`, {
    next: { revalidate: 1000 * 60 * 5 },
  })

  return getBlogsValidator
    .omit({ totalRows: true, rowsSelected: true })
    .parse(result)
}
