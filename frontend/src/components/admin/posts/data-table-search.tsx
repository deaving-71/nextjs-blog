import { useRouter } from "next/navigation"

import { generateUrlWithParams } from "@/lib/utils"
import { useBlogPostsSearchParams } from "@/hooks/useBlogPostsSearchParams"
import { useCurrentUrl } from "@/hooks/useCurrentUrl"
import { useDebounce } from "@/hooks/useDebounce"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export function DataTableSearch() {
  const router = useRouter()
  const debounce = useDebounce()
  const currentUrl = useCurrentUrl()

  return (
    <form className="flex-1">
      <div className="relative">
        <Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search blog post..."
          className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          onInput={(e) => {
            debounce(() => {
              if (e.target instanceof HTMLInputElement)
                router.push(
                  generateUrlWithParams(currentUrl, {
                    search: e.target.value === "" ? null : e.target.value,
                  })
                )
            }, 500)
          }}
        />
      </div>
    </form>
  )
}
