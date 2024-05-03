import { env } from "@/env.mjs"

const BASE_URL = env.NEXT_PUBLIC_API_URL

export type RequestBody = Object | FormData | string | number | null
export type FetcherOptions = {
  headers?: Headers
  body?: RequestBody
  method?: string
  next?: NextFetchRequestConfig
}

export async function fetcher(url: string, opts?: FetcherOptions) {
  const headers = new Headers(opts?.headers)
  headers.set("Accept", "application/json; charset=utf-8")

  let body = null

  if (typeof opts?.body === "object" && !(opts?.body instanceof FormData)) {
    body = JSON.stringify(opts.body)
    headers.set("Content-Type", "application/json; charset=utf-8")
  }

  if (opts?.body instanceof FormData) body = opts.body

  const response = await fetch(api(url), {
    ...(body ? { body } : {}),
    ...(opts?.next ? { next: opts.next } : {}),
    headers,
    credentials: "include",
    mode: "cors",
  })

  let result

  const contentType = response.headers.get("Content-Type")
  switch (contentType) {
    case "application/json; charset=utf-8":
      result = await response.json()
      break

    case "text/plain; charset=utf-8":
      result = await response.text()
      break

    default:
      result = null
      break
  }

  if (!response.ok) throw result

  return result
}

/**
 * @param url must start with a forward slash
 * @returns returns an absolute path to the api endpoint
 */
export function api(url: string) {
  const route = `${BASE_URL}${url}`
  return route
}
