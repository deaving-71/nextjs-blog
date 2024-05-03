import Image from "next/image"
import Link from "next/link"
import { Blog } from "@/types"

import { shortDateFormat } from "@/lib/date-utils"

import { Badge } from "../ui/badge"

export function BlogCard(
  blog: Omit<Blog, "content"> & { previewContent: string }
) {
  return (
    <article>
      <Link
        href={`/blogs/${blog.slug}`}
        className="block h-[465px] space-y-3 rounded-md border border-secondary/60 bg-secondary/20 p-4 transition-all hover:bg-secondary"
      >
        <Image
          className="aspect-video w-full  rounded-md object-cover object-center"
          src={blog.thumbnail}
          alt={blog.title}
          width={380}
          height={380}
        />
        <div className="space-y-2">
          <time
            dateTime={blog.publishedAt}
            className="block text-sm text-foreground/60"
          >
            {shortDateFormat(blog.publishedAt)}
          </time>
          <h2 className="line-clamp-2 text-2xl font-bold">{blog.title}</h2>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {blog.previewContent}
          </p>
          <ul className="flex items-center gap-[1ch]">
            {blog.tags.map((tag) => (
              <li key={tag.id}>
                <Badge>{tag.name}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  )
}
