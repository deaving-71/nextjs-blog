"use client"

import { useGetAnalysis } from "@/hooks/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Cards() {
  const analytics = useGetAnalysis()

  const { blogsCount } = analytics.data
  return (
    <div className="grid max-w-[800px] grid-cols-3 gap-8">
      <Card className="text-2xl *:p-3">
        <CardHeader className="!pb-0">
          <CardTitle>{blogsCount.total}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="">Total Posts</p>
        </CardContent>
      </Card>
      <Card className="text-2xl *:p-3">
        <CardHeader className="!pb-0">
          <CardTitle>{blogsCount.published}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Published Posts</p>
        </CardContent>
      </Card>
      <Card className="text-2xl *:p-3">
        <CardHeader className="!pb-0">
          <CardTitle>{blogsCount.draft}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Draft Posts</p>
        </CardContent>
      </Card>
    </div>
  )
}
