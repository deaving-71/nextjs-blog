import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPaginationPages(currentPage: number, totalPages: number) {
  const maxPagesToShow = 5
  const pages = []

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)

    if (currentPage <= 2) {
      endPage = Math.min(maxPagesToShow, totalPages)
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }

  return pages
}

export function slugify(str: string) {
  if (str === "") return str

  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

export function generateUrlWithParams(
  baseUrl: string,
  setparams: Record<string, any>
) {
  if (!baseUrl.startsWith("http")) return ""

  const url = new URL(baseUrl)

  Object.entries(setparams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      url.searchParams.delete(key)
      return
    }
    url.searchParams.set(key, value)
  })

  return url.href
}
