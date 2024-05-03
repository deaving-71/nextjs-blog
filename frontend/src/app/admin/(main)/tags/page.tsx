"use client"

import { Suspense, useState } from "react"
import { NextSearchParams } from "@/types"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeleteTagModal, TagForm, TagFormModal } from "@/components/admin/tags"
import { TagsDataTable } from "@/components/admin/tags/data-table"
import { Loading } from "@/components/common"

export type TagsPageProps = {
  searchParams: NextSearchParams
}

export default function TagsPage({ searchParams }: TagsPageProps) {
  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)

  return (
    <Suspense fallback={<Loading />}>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl lg:text-5xl">Tags</h1>
          <Dialog
            open={openCreateTagDialog}
            onOpenChange={setOpenCreateTagDialog}
          >
            <DialogTrigger asChild>
              <Button>New tag</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new tag</DialogTitle>
                <TagForm
                  action="create"
                  setOpenDialog={setOpenCreateTagDialog}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <TagsDataTable />

        {searchParams?.action === "update" && <TagFormModal />}
        {searchParams?.action === "delete" && <DeleteTagModal />}
      </section>
    </Suspense>
  )
}
