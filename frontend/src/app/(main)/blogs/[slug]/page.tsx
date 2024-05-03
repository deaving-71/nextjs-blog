import Image from "next/image"
import Link from "next/link"

import "@/styles/unreset.css"

import { getBlogPost } from "@/lib/actions/server/get-blog-post"
import { shortDateFormat } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = await getBlogPost(slug)

  return (
    <article className="mx-auto max-w-[950px] space-y-4 pt-8">
      <Image
        src={post.thumbnail}
        alt={post.title}
        width={950}
        height={500}
        className="mx-auto max-h-[500px] rounded-md object-cover object-center"
      />
      <span className="inline-block text-sm text-muted-foreground">
        Published on &nbsp;
        <time dateTime={post.publishedAt}>
          {shortDateFormat(post.publishedAt)}
        </time>
      </span>
      <h1 className="text-5xl font-bold">{post.title}</h1>
      <div>
        <ul className="inline-flex items-center gap-[1ch]">
          {post.tags.map((tag) => (
            <li key={tag.id}>
              <Link href={"/blogs?tag=" + tag.slug}>
                <Badge>{tag.name}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p
        className="unreset pt-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
