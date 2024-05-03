"use client"

import { useGetAllBlogPostsQuery } from "@/hooks/blogs"
import { DataTable } from "@/components/ui/data-table"

import { columns } from "./columns"

export function PostsDataTable() {
  const blogs = useGetAllBlogPostsQuery()

  return (
    <div className="max-h-[calc(100dvh-290px)] overflow-auto rounded-md border">
      <DataTable columns={columns} data={blogs.data.posts} />
    </div>
  )
}
