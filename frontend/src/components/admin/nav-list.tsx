import Link from "next/link"

import { Icons } from "../icons"

export function NavList() {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="/admin"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Icons.Home className="h-4 w-4" />
        Dashboard
      </Link>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Icons.Panels className="h-4 w-4" />
        View Site
        <Icons.ExternalLink className="size-2.5 -translate-y-1" />
      </a>
      <div className="flex w-full items-center pt-6">
        <Link
          href="/admin/posts"
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Icons.SquarePen className="h-4 w-4" />
          Posts
        </Link>
        <Link
          href="/admin/editor/post"
          className="rounded-full p-1 text-muted-foreground transition-all hover:bg-background/50 hover:text-primary"
        >
          <Icons.Plus className="size-6" />
        </Link>
      </div>
      <Link
        href="/admin/posts?status=published"
        className="ml-7 flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        Published
      </Link>
      <Link
        href="/admin/posts?status=draft"
        className="ml-7 flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        Drafts
      </Link>
      <Link
        href="/admin/tags"
        className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Icons.Tag className="h-4 w-4" />
        Tags
      </Link>
      {/* <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <Package className="h-4 w-4" />
              Products{" "}
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link> */}
    </nav>
  )
}
