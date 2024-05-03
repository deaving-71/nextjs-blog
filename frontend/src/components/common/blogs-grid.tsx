import { Blog } from "@/types"

import { BlogCard } from "./blog-card"

export type BlogsGridProps = {
  posts: (Omit<Blog, "content"> & { previewContent: string })[]
}

export function BlogsGrid({ posts }: BlogsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <BlogCard key={post.id} {...post} />
      ))}
    </div>
  )
}
