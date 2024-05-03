"use client"

import { Suspense } from "react"

import { Editor } from "@/components/admin/posts"
import { LoadingSpinner } from "@/components/common/loading-spinner"

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <div className="m-auto *:size-20">
          <LoadingSpinner />
        </div>
      }
    >
      <Editor action="create" />
    </Suspense>
  )
}
