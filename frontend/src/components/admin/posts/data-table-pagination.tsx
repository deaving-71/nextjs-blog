import { useRouter } from "next/navigation"

import { generateUrlWithParams } from "@/lib/utils"
import { useGetAllBlogPostsQuery } from "@/hooks/blogs"
import { useBlogPostsSearchParams } from "@/hooks/useBlogPostsSearchParams"
import { useCurrentUrl } from "@/hooks/useCurrentUrl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaginationControlls } from "@/components/ui/pagination-controlls"

export function DataTablePagination() {
  const router = useRouter()
  const { limit, tag, status, search } = useBlogPostsSearchParams()

  const blogs = useGetAllBlogPostsQuery()
  const currentUrl = useCurrentUrl()

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        {blogs.data.rowsSelected} of {blogs.data.totalRows} row(s) selected.
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="whitespace-nowrap text-sm">Rows per page</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="size-8">
                {limit ?? 10}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <DropdownMenuCheckboxItem
                  key={pageSize}
                  checked={(limit ?? "10") === pageSize.toString()}
                  onClick={() => {
                    router.push(
                      generateUrlWithParams(currentUrl, {
                        page: 1,
                        limit: pageSize,
                        tag,
                        status,
                        search,
                      })
                    )
                  }}
                >
                  {pageSize}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <PaginationControlls
          canNextPage={blogs.data.canNextPage}
          canPrevPage={blogs.data.canPrevPage}
          currentPage={blogs.data.currentPage}
          totalPages={blogs.data.totalPages}
        />
      </div>
    </div>
  )
}
