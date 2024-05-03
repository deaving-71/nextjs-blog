import { z } from "zod"

import { blogSchema } from "./blogs"

export const getAnalysisValidator = z.object({
  blogsCount: z.object({
    total: z.number(),
    published: z.number(),
    draft: z.number(),
  }),
})
