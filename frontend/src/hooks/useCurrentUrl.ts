import { useEffect, useMemo, useState } from "react"

import { useBlogPostsSearchParams } from "./useBlogPostsSearchParams"

export function useCurrentUrl() {
  const searchParams = useBlogPostsSearchParams()
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [
    searchParams.limit,
    searchParams.page,
    searchParams.status,
    searchParams.tag,
  ])

  return currentUrl
}
