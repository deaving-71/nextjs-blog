import { getBlogs } from "@/lib/actions/server/get-blogs"
import { PaginationControlls } from "@/components/ui/pagination-controlls"
import { BlogsGrid, TagsCarousel } from "@/components/common"

type BlogsPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const tag = searchParams?.tag as string
  const page = searchParams?.page as string

  const { posts, ...paginationProps } = await getBlogs({ limit: 9, tag, page })

  return (
    <main className="py-8">
      <TagsCarousel />
      <BlogsGrid posts={posts} />
      <div className="py-2"></div>
      <PaginationControlls {...paginationProps} />
    </main>
  )
}
