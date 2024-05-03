import { z } from "zod"

import { createTagValidator, tagSchema } from "@/lib/validator/tags"

export type Tag = z.infer<typeof tagSchema>
export type NewTag = z.infer<typeof createTagValidator>
