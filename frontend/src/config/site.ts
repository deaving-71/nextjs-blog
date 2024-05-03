import { env } from "@/env.mjs"

export const siteConfig = {
  name: "Next Blog",
  author: "deaving-71",
  description: "Exploring the Boundless World of Ideas",
  keywords: ["Next.js", "React", "Tailwind CSS", "Radix UI", "shadcn/ui"],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://deaving.vercel.app",
  },
  links: {
    github: "https://github.com/deaving-71",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
