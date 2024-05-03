"use client"

import { cn, generateUrlWithParams, getPaginationPages } from "@/lib/utils"
import { useBlogPostsSearchParams } from "@/hooks/useBlogPostsSearchParams"
import { useCurrentUrl } from "@/hooks/useCurrentUrl"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export type PaginationControllsProps = {
  currentPage: number
  totalPages: number
  canNextPage: boolean
  canPrevPage: boolean
}

export function PaginationControlls({
  canNextPage,
  canPrevPage,
  currentPage,
  totalPages,
}: PaginationControllsProps) {
  const searchParams = useBlogPostsSearchParams()

  const pages = getPaginationPages(currentPage, totalPages)

  const currentUrl = useCurrentUrl()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {canPrevPage ? (
            <PaginationPrevious
              href={generateUrlWithParams(currentUrl, {
                page: currentPage - 1,
              })}
            />
          ) : (
            <Button variant="ghost" disabled>
              Previous
            </Button>
          )}
        </PaginationItem>

        {1 < pages.at(0)! && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((num) => (
          <PaginationItem key={num}>
            <PaginationLink
              href={generateUrlWithParams(currentUrl, { page: num })}
              className={cn(
                (searchParams.page === num.toString() ||
                  (!searchParams.page && num === 1)) &&
                  "bg-secondary"
              )}
            >
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > pages.at(-1)! && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          {canNextPage ? (
            <PaginationNext
              href={generateUrlWithParams(currentUrl, {
                page: currentPage + 1,
              })}
            />
          ) : (
            <Button variant="ghost" disabled>
              Next
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
