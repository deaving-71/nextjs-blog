"use client"

// Error components must be Client Components
import { useEffect } from "react"
import { AlertTriangleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="m-auto flex h-fit w-full flex-col items-center justify-center gap-6 px-4 md:px-6">
      <div className="grid max-w-md gap-4 text-center">
        <AlertTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Oops, something went wrong!
        </h1>
        <p className="text-muted-foreground">
          We&apos;re sorry, but an unexpected error has occurred. Please try
          refreshing the page.
        </p>
        <Button className="mx-auto w-full max-w-[200px]" onClick={reset}>
          Reload Page
        </Button>
      </div>
    </div>
  )
}
