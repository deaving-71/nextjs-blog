"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Badge } from "../ui/badge"

type TagProps = {
  name: string
  slug?: string
  href: string
}
export function Tag({ name, slug = "", href }: TagProps) {
  const searchParams = useSearchParams()
  const tag = searchParams.get("tag")

  return (
    <Badge variant={tag === slug ? "secondary" : "default"}>
      <Link href={href}>{name}</Link>
    </Badge>
  )
}
