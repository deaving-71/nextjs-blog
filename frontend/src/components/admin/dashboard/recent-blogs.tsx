"use client"

import Link from "next/link"

import { useGetAllBlogPostsQuery } from "@/hooks/blogs"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

import { columns } from "../posts"

export function RecentBlogs() {
  const blogs = useGetAllBlogPostsQuery({ limit: 5 })

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Recent Posts</h2>
        <Button asChild>
          <Link href="/admin/posts">View all</Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <DataTable columns={columns} data={blogs.data.posts} />
      </div>
    </>
  )
}
