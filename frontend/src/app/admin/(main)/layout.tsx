"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCheckAuthentication } from "@/hooks/auth"
import { MobileSidebar, Sidebar } from "@/components/admin"
import { TopBar } from "@/components/admin/top-bar"
import { Loading } from "@/components/common/loading"

export type AuthLayoutProps = React.PropsWithChildren

export default function DashboardLayout({ children }: AuthLayoutProps) {
  const { data, isLoading } = useCheckAuthentication()
  const router = useRouter()

  useEffect(() => {
    if (data && !data.isAuthenticated) {
      router.push("/admin/auth/sign-in")
    }
  }, [data])

  if (isLoading || !data?.isAuthenticated)
    return (
      <div className="grid h-dvh place-content-center">
        <Loading />
      </div>
    )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />
          <TopBar />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
