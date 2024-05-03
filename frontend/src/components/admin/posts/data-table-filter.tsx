import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn, generateUrlWithParams } from "@/lib/utils"
import { useGetTagsQuery } from "@/hooks/tags"
import { useBlogPostsSearchParams } from "@/hooks/useBlogPostsSearchParams"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

export function DataTableFilter() {
  const router = useRouter()

  const tags = useGetTagsQuery()

  const { status: currentStatus, tag } = useBlogPostsSearchParams()

  const currentTag = tags.data.find((t) => t.slug === tag)

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="inline-flex h-8 w-fit" variant="ghost">
            {currentTag ? currentTag.name : "Tag"}&nbsp;
            <Icons.ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuCheckboxItem
            checked={!tag}
            onClick={() => {
              router.push(
                generateUrlWithParams(
                  `${window.location.origin}/${window.location.pathname}`,
                  {
                    status: currentStatus,
                  }
                )
              )
            }}
          >
            All
          </DropdownMenuCheckboxItem>
          {tags.data.map((t) => {
            return (
              <DropdownMenuCheckboxItem
                key={t.id}
                checked={tag === t.slug}
                onClick={() => {
                  router.push(
                    generateUrlWithParams(
                      `${window.location.origin}/${window.location.pathname}`,
                      {
                        tag: t.slug,
                        status: currentStatus,
                      }
                    )
                  )
                }}
              >
                {t.name}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "inline-flex h-8 w-fit capitalize transition-none",
              currentStatus === "published" && "text-green-500",
              currentStatus === "draft" && "text-red-500"
            )}
            variant="ghost"
          >
            {currentStatus ? currentStatus : "status"}&nbsp;
            <Icons.ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={!currentStatus}>
            <Link
              className="block w-16"
              href={generateUrlWithParams(
                `${window.location.origin}/${window.location.pathname}`,
                {
                  tag,
                }
              )}
            >
              All
            </Link>
          </DropdownMenuCheckboxItem>
          {["published", "draft"].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              className="capitalize"
              checked={status === currentStatus}
              onClick={() => {
                router.push(
                  generateUrlWithParams(
                    `${window.location.origin}/${window.location.pathname}`,
                    {
                      tag,
                      status: status,
                    }
                  )
                )
              }}
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
