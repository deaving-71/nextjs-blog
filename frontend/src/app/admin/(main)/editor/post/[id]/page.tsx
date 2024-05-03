"use client"

import { Suspense } from "react"
import { notFound } from "next/navigation"

import { useGetBlogPostQuery } from "@/hooks/blogs"
import { Editor } from "@/components/admin/posts"
import { Loading } from "@/components/common/loading"

type UpdatePostPageProps = {
  params: { id: string }
}

export default function UpdatePostPage({ params }: UpdatePostPageProps) {
  const post = useGetBlogPostQuery(params.id)

  if (post.isLoading) return <Loading />

  if (!post.data) {
    notFound()
  }

  return (
    <Suspense fallback={<Loading />}>
      <Editor post={post.data} action="update" />
    </Suspense>
  )
}
