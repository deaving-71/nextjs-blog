"use client"

import { useGetTagsQuery } from "@/hooks/tags"
import { DataTable } from "@/components/ui/data-table"

import { columns } from "./columns"

export function TagsDataTable() {
  const tags = useGetTagsQuery()

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={tags.data} />
    </div>
  )
}
