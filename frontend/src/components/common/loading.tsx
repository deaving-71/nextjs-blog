import { cn } from "@/lib/utils"

import { LoadingSpinner } from "./loading-spinner"

type LoadingProps = {
  className?: string
}

export function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("m-auto *:size-20", className)}>
      <LoadingSpinner />
    </div>
  )
}
