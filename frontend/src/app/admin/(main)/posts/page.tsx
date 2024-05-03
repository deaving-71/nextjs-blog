"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DataTableFilter,
  DataTableSearch,
  DeletePostModal,
  PostsDataTable,
} from "@/components/admin/posts"
import { DataTablePagination } from "@/components/admin/posts/data-table-pagination"
import { Loading } from "@/components/common"

export default function PostsPage() {
  const searchParams = useSearchParams()
  const action = searchParams.get("action")

  return (
    <Suspense fallback={<Loading />}>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl lg:text-5xl">Posts</h1>
          <Button asChild>
            <Link href="/admin/editor/post">New post</Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <DataTableSearch />
          <DataTableFilter />
        </div>
        <PostsDataTable />
        <DataTablePagination />

        {action === "delete" && <DeletePostModal />}
      </section>
    </Suspense>
  )
}
