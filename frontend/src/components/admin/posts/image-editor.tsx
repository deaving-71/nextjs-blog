import React, { useRef, useState } from "react"
import Cropper, { ReactCropperElement } from "react-cropper"

import "cropperjs/dist/cropper.css"

import { DialogTrigger } from "@radix-ui/react-dialog"

import { base64ToBlob } from "@/lib/file-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

export type ImageEditorProps = {
  id?: string
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  onError: (message: string) => void
  onChange?: (file: File | null) => void
}

export function ImageEditor({
  id,
  file,
  setFile,
  onChange,
  onError,
}: ImageEditorProps) {
  const thumbnailPreview = file ? URL.createObjectURL(file) : null

  const [open, setOpen] = useState(false)

  const cropperRef = useRef<ReactCropperElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = (e.target as HTMLInputElement).files?.item(0)

    if (!file) return

    if (!file.type.startsWith("image")) {
      onError && onError("Only images are allowed")
      onChange && onChange(null)
      return
    }

    setFile(file)
    onChange && onChange(file)
    setOpen(true)
  }

  function handleCrop() {
    const cropper = cropperRef.current?.cropper

    if (!file) return setOpen(false)

    const type = file.type

    cropper?.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return

      const newFile = new File([blob], "thumbnail", { type })
      setFile(newFile)
      onChange && onChange(newFile)
    })

    setOpen(false)
  }

  function handleRemoveImage() {
    setFile(null)
    onChange && onChange(null)
    setOpen(false)

    const fileInput = fileInputRef.current
    if (!fileInput) return
    fileInput.value = ""
  }

  return (
    <div>
      {!thumbnailPreview && (
        <label
          htmlFor={id}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-all hover:text-foreground"
          )}
        >
          <Icons.Plus className="size-5" />
          Add a thumbnail
        </label>
      )}
      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        id={id}
        onChange={handleFileUpload}
      />

      <div className="relative">
        {thumbnailPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailPreview}
            alt="some_image"
            className="object-cover object-center"
            width={950}
            height={600}
          />
        )}

        <div className="absolute right-3 top-3 space-x-1">
          <Dialog open={open} onOpenChange={setOpen} modal={true}>
            {file && (
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8"
                >
                  <Icons.Pen className="size-4" />
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="w-full max-w-[980px]">
              <DialogHeader>Edit thumbnail</DialogHeader>
              <Cropper
                src={thumbnailPreview ?? "#"}
                className="h-[400px] w-full"
                initialAspectRatio={16 / 9}
                guides={false}
                ref={cropperRef}
              />
              <Button type="button" className="w-fit" onClick={handleCrop}>
                Save
              </Button>
            </DialogContent>
          </Dialog>
          {file && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleRemoveImage}
            >
              <Icons.Trash className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
