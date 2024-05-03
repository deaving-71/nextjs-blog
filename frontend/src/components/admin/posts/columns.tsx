"use client"

import Link from "next/link"
import { Blog } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

import { shortDateFormat } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../../icons"
import { Badge } from "../../ui/badge"

export const columns: ColumnDef<Omit<Blog, "content" | "thumbnail">>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags

      return (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id}>{tag.name}</Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <div
          className={cn(
            "capitalize",
            status === "published" ? "text-green-400" : "text-red-400"
          )}
        >
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Published At",
    cell: ({ row }) => {
      const value = row.original.publishedAt
      if (!value) return ""
      return shortDateFormat(value)
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.TripeDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Preview</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/editor/post/${id}`}>Update post</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" asChild>
              <Link href={`/admin/posts?action=delete&id=${id}`}>
                Delete post
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
