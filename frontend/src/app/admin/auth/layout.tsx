"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCheckAuthentication } from "@/hooks/auth"
import { Loading } from "@/components/common/loading"

export type AuthLayoutProps = React.PropsWithChildren

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { data, isLoading } = useCheckAuthentication()
  const router = useRouter()

  useEffect(() => {
    if (data && data.isAuthenticated) {
      router.push("/admin")
    }
  }, [data])

  if (isLoading || data?.isAuthenticated) return <Loading />

  return (
    <div className="grid h-full min-h-dvh place-content-center">{children}</div>
  )
}
