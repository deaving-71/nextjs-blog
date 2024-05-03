import Link from "next/link"

import { Icons } from "../icons"
import { NavLink } from "./nav-link"

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  { name: "Blogs", href: "/blogs" },
]

export function Header() {
  return (
    <header className="flex justify-center">
      <nav className="pt-2">
        <ul className="inline-flex items-center rounded-3xl border px-5">
          {navItems.map((navItem) => (
            <NavLink key={navItem.href} href={navItem.href}>
              {navItem.name}
            </NavLink>
          ))}
          <NavLink href="https://github.com/deaving-71" target="_blank">
            Github
            <Icons.ExternalLink className="size-2.5 translate-x-1 translate-y-[-0.125rem]" />
          </NavLink>
        </ul>
      </nav>
    </header>
  )
}
