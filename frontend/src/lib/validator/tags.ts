import { z } from "zod"

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Please enter a valid name."),
  slug: z.string().min(1, "Please enter a valid slug"),
})

export const getTagsValidator = z.array(tagSchema)

export const createTagValidator = tagSchema.omit({ id: true })

export const updateTagValidator = createTagValidator.partial()
