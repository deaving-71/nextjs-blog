import { Suspense } from "react"

import { Cards, RecentBlogs } from "@/components/admin/dashboard"
import { Loading } from "@/components/common"

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Cards />
      <RecentBlogs />
    </Suspense>
  )
}
