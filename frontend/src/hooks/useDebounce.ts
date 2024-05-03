import { useRef } from "react"

export function useDebounce() {
  const debounceSeed = useRef<NodeJS.Timeout | null>(null)

  const debounceFunction = useRef((func: () => void, timeout = 200) => {
    if (debounceSeed.current) {
      clearTimeout(debounceSeed.current)
      debounceSeed.current = null
    }
    debounceSeed.current = setTimeout(() => {
      func()
    }, timeout)
  })
  // a debounce function is returned
  return debounceFunction.current
}
