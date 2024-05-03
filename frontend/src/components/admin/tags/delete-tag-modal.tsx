import { useRouter, useSearchParams } from "next/navigation"

import { useDeleteTag, useGetTagsQuery } from "@/hooks/tags"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeleteTagModal() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = searchParams.get("id")

  const tags = useGetTagsQuery()

  const deleteTag = useDeleteTag(id, {
    onSuccess: async () => {
      await tags.refetch()
      router.push("/admin/tags")
    },
    onError: (error) => {
      console.error(error)
    },
  })

  function onOpenChange(open: boolean) {
    if (open === false) router.push("/admin/tags")
  }

  return (
    <AlertDialog open={true} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this tag
            and the posts related to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/60"
            onClick={() => deleteTag.mutate()}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
