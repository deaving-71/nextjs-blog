import { useRouter, useSearchParams } from "next/navigation"

import { useDeleteBlogPost, useGetAllBlogPostsQuery } from "@/hooks/blogs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeletePostModal() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = searchParams.get("id")
  const posts = useGetAllBlogPostsQuery()
  const deletePost = useDeleteBlogPost(id, {
    onSuccess: async () => {
      await posts.refetch()
      router.push("/admin/posts")
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return (
    <AlertDialog
      open={true}
      onOpenChange={(open) => {
        if (open === false) {
          router.push("/admin/posts")
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/60"
            onClick={() => {
              deletePost.mutate()
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
