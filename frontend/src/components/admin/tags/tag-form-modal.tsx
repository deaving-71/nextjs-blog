import { useRouter, useSearchParams } from "next/navigation"

import { useGetTagQuery } from "@/hooks/tags"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { TagForm } from "./tag-form"

export function TagFormModal() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = searchParams.get("id")

  const tag = useGetTagQuery(id)

  function onOpenChange(open: boolean) {
    if (open === false) router.push("/admin/tags")
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pb-4">
          <DialogTitle>Update tag</DialogTitle>
        </DialogHeader>
        <TagForm action="update" tag={tag.data} />
      </DialogContent>
    </Dialog>
  )
}
