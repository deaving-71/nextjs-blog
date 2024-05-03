"use client"

import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { NewTag, Tag } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { identity } from "lodash"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { env } from "@/env.mjs"
import { errorHandler } from "@/lib/actions/client/error-handler"
import { slugify } from "@/lib/utils"
import { createTagValidator, updateTagValidator } from "@/lib/validator/tags"
import { useCreateTag, useGetTagsQuery, useUpdateTag } from "@/hooks/tags"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export type TagFormProps = {
  setOpenDialog?: Dispatch<SetStateAction<boolean>>
} & (
  | {
      action: "create"
      tag?: Tag
    }
  | {
      action: "update"
      tag: Tag
    }
)
const formSchema = createTagValidator

export function TagForm({ action, tag, setOpenDialog }: TagFormProps) {
  const defaultValues =
    action === "create"
      ? {
          name: "",
          slug: "",
        }
      : {
          name: tag.name,
          slug: tag.slug,
        }

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const tags = useGetTagsQuery()

  const createTag = useCreateTag({
    onSuccess: async () => {
      await tags.refetch()
      setOpenDialog && setOpenDialog(false)
    },
    onError: (err) => {
      errorHandler(err, ({ errors }) => {
        for (let key in errors.fieldErrors) {
          const message = errors.fieldErrors[key][0]
          form.setError(`root.${key}`, { message })
        }
      })
    },
  })

  const updateTag = useUpdateTag({
    onSuccess: async () => {
      await tags.refetch()
      router.push("/admin/tags")
    },
    onError: (err) => {
      errorHandler(err, ({ errors }) => {
        for (let key in errors.fieldErrors) {
          const message = errors.fieldErrors[key][0]
          form.setError(`root.${key}`, { message })
        }
      })
    },
  })

  const isPending = createTag.isPending || updateTag.isPending

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isPending) return

    if (action === "create") {
      createTag.mutate(values)
    } else {
      updateTag.mutate({ id: tag.id, data: values })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                {env.NEXT_PUBLIC_APP_URL}/tags/{slugify(field.value ?? "")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="capitalize">
          {isPending ? `${action}...` : action}
        </Button>
      </form>
    </Form>
  )
}
