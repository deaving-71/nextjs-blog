"use client"

import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type NavLinkProps = LinkProps & React.ComponentPropsWithoutRef<"a">

export function NavLink({ href, className, ...props }: NavLinkProps) {
  const pathname = usePathname()

  return (
    <li>
      <Link
        {...props}
        className={cn(
          "inline-flex p-2 text-muted-foreground transition-all hover:text-foreground",
          pathname === href &&
            "border-b border-primary aria-[current=true]:text-foreground"
        )}
        href={href}
        aria-current={pathname === href}
      />
    </li>
  )
}
