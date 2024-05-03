import Link from "next/link"

import { getBlogs } from "@/lib/actions/server/get-blogs"

import { BlogsGrid } from "../common"
import { Icons } from "../icons"

export async function Blogs() {
  const { posts } = await getBlogs({ limit: 6 })

  return (
    <section id="blogs" className="pb-8">
      <h2 className="pb-8 text-center text-5xl font-bold">Our Blogs</h2>
      <BlogsGrid posts={posts} />
      <div className="pt-6 text-center">
        <Link className="group flex items-center justify-center" href="/blogs">
          <span>View more articles&nbsp;</span>
          <Icons.arrowRight
            className="transition-all group-hover:translate-x-1"
            size={16}
          />
        </Link>
      </div>
    </section>
  )
}
