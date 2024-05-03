"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Blog, Tag } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle from "@tiptap/extension-text-style"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { pick } from "lodash"
import { DateTime } from "luxon"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { env } from "@/env.mjs"
import { errorHandler } from "@/lib/actions/client/error-handler"
import { createFormData } from "@/lib/formdata-utils"
import { slugify } from "@/lib/utils"
import { createBlogValidator } from "@/lib/validator/blogs"
import {
  useCreateBlogPost,
  useGetBlogPostQuery,
  useGetImageFile,
  useUpdateBlogPost,
} from "@/hooks/blogs"
import { useGetTagsQuery } from "@/hooks/tags"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Loading } from "@/components/common/loading"
import { LoadingSpinner } from "@/components/common/loading-spinner"

import { Icons } from "../../icons"
import { Switch } from "../../ui/switch"
import { TagsSelect } from "../../ui/tags-select"
import { ImageEditor } from "./image-editor"
import { Markdown } from "./markdown"

type EditorProps =
  | {
      action: "create"
      post?: Blog
    }
  | {
      action: "update"
      post: Blog
    }

const formSchema = createBlogValidator

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
]

export function Editor({ action, post: blogPost }: EditorProps) {
  const router = useRouter()

  const publishedAt =
    action === "create"
      ? DateTime.now().toISO()
      : blogPost?.publishedAt ?? DateTime.now().toISO()

  const initialThumbnail = new File([], "empty_image")
  const defaultValues: z.infer<typeof createBlogValidator> =
    action === "create"
      ? {
          title: "",
          content: "Begin typing your post...",
          slug: "",
          thumbnail: initialThumbnail,
          status: "draft",
          tags: [],
          publishedAt,
        }
      : {
          ...blogPost,
          thumbnail: initialThumbnail,
          publishedAt,
          tags: blogPost.tags.map((tag) => tag.id),
        }

  const thumbnailFile = useGetImageFile(blogPost?.thumbnail, {
    enabled: action === "update" && !!blogPost?.thumbnail,
  })

  const [hasEditedSlugField, setHasEditedSlugField] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(blogPost?.tags ?? [])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [isThumbnailDirty, setIsThumbnailDirty] = useState(false)

  const editor = useEditor({
    extensions,
    content: defaultValues.content,
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), { shouldDirty: true })
    },
  })

  const post = useGetBlogPostQuery(action === "update" ? blogPost.id : "")
  const tags = useGetTagsQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const createBlog = useCreateBlogPost({
    onSuccess(data) {
      router.push(`/admin/editor/post/${data.id}`)
      toast.success("Blog post created")
    },
    onError(err) {
      errorHandler(err, ({ errors }) => {
        for (let key in errors.fieldErrors) {
          const message = errors.fieldErrors[key][0]
          form.setError(`root.${key}`, { message })
        }
      })
    },
  })

  const updateBlog = useUpdateBlogPost({
    onSuccess: async () => {
      await post.refetch()
      toast.success("Blog post updated")
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

  const isPending = createBlog.isPending || updateBlog.isPending

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (action === "update") {
      const dirtyFields = Object.keys(form.formState.dirtyFields)
      isThumbnailDirty && dirtyFields.push("thumbnail")

      const data = pick(values, dirtyFields)

      const formData = createFormData(data)
      updateBlog.mutate({ id: blogPost.id, data: formData })
    } else {
      const formData = createFormData(values)
      createBlog.mutate(formData)
    }
  }

  function onThumbnailChange(file: File | null) {
    if (file === null) {
      setIsThumbnailDirty(false)
      return form.setValue("thumbnail", initialThumbnail)
    }

    form.setValue("thumbnail", file, {
      shouldDirty: true,
      shouldValidate: true,
    })

    setIsThumbnailDirty(true)
  }

  function onThumbnailInputError(message: string) {
    form.setError("thumbnail", { message })
  }

  function onTitleInput(e: React.FormEvent<HTMLInputElement>) {
    if (action !== "create" || hasEditedSlugField) return
    form.setValue("slug", slugify((e.target as HTMLInputElement).value))
  }

  function onSlugInput() {
    if (hasEditedSlugField) return
    setHasEditedSlugField(true)
  }

  function onDateSelect(date?: Date) {
    if (!date) return

    form.setValue("publishedAt", DateTime.fromJSDate(date).toISO()!, {
      shouldDirty: true,
    })
  }

  function onTagsSelect(tags: Tag[]) {
    form.setValue(
      "tags",
      tags.map((tag) => tag.id),
      { shouldDirty: true }
    )
  }

  function onStatusChange(checked: boolean) {
    form.setValue("status", checked ? "published" : "draft", {
      shouldDirty: true,
    })
  }

  useEffect(() => {
    if (action === "update" && thumbnailFile.data) {
      form.setValue("thumbnail", thumbnailFile.data, { shouldDirty: false })
      setThumbnail(thumbnailFile.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnailFile.data])

  if (!editor) return

  if (action === "update" && thumbnailFile.isLoading) return <Loading />

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-end pb-8">
          <Button
            type="submit"
            className="font-bold"
            disabled={
              (!form.formState.isDirty && !isThumbnailDirty) || isPending
            }
          >
            {isPending && <LoadingSpinner />}&nbsp;
            {action === "create" ? "Create Post" : "Save Post"}
          </Button>
        </div>
        <div className="grid grid-cols-[1fr,360px]">
          <div className="mx-auto w-full max-w-[950px] space-y-4 px-16 py-8">
            <FormField
              control={form.control}
              name="thumbnail"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageEditor
                      id="thumbnail"
                      file={thumbnail}
                      setFile={setThumbnail}
                      onChange={onThumbnailChange}
                      onError={onThumbnailInputError}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-16 border-0 p-0 text-5xl outline-none placeholder:text-muted-foreground/60 focus-visible:ring-transparent"
                      placeholder="Post title"
                      onInput={onTitleInput}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Markdown editor={editor} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="h-fit space-y-8 rounded-md border p-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">Slug</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="absolute inset-y-0 left-0 inline-flex h-10 items-center justify-center rounded-l-md bg-muted/40 p-3">
                        {<Icons.Link className="size-4" />}
                      </span>
                      <Input
                        className="pl-12"
                        placeholder="post-title"
                        onInput={onSlugInput}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {env.NEXT_PUBLIC_APP_URL}/{slugify(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">Publish date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={
                            "w-full justify-start text-left font-normal text-muted-foreground"
                          }
                        >
                          <Icons.Calendar className="mr-2 h-4 w-4" />
                          {DateTime.fromISO(field.value).toLocaleString(
                            DateTime.DATE_MED
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(publishedAt)}
                          onSelect={onDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel className="block">Tags</FormLabel>
                  <FormControl>
                    <TagsSelect
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                      autoCompleteOptions={tags.data}
                      onSelect={onTagsSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem>
                  <FormLabel className="block">Status</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Switch
                        className="data-[state=checked]:bg-green-500"
                        checked={form.getValues("status") === "published"}
                        onCheckedChange={onStatusChange}
                      />
                    </FormControl>
                    <span className="capitalize">
                      {form.getValues("status")}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
