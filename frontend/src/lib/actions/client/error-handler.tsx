import toast from "react-hot-toast"
import {
  inferFlattenedErrors,
  typeToFlattenedError,
  z,
  ZodError,
  ZodSchema,
  ZodType,
} from "zod"

export const errorRequestSchema = z.object({
  message: z.string(),
})

const formErrorSchema = z.object({
  message: z.string(),
  errors: z.object({
    formErrors: z.any(),
    fieldErrors: z.record(z.string(), z.array(z.string())),
  }),
})

export type ErrorHandlerOptions = {}

export function errorHandler(
  errors: unknown,
  callback?: (err: z.infer<typeof formErrorSchema>) => void
) {
  const formErrors = formErrorSchema?.safeParse(errors)

  if (formErrors?.success) {
    return callback && callback(formErrors.data)
  }

  const requestError = errorRequestSchema.safeParse(errors)
  if (requestError.success) {
    return toast.error(requestError.data.message)
  }

  return toast.error("Internal server error, please try again later")
}
