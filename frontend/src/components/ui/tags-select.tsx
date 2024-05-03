import React, { Dispatch, SetStateAction } from "react"
import { Tag } from "@/types"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../icons"
import { Button } from "./button"

export type TagsSelectProps = {
  selectedTags: Tag[]
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>
  autoCompleteOptions: Tag[]
  onSelect?: (tags: Tag[]) => void
}

export function TagsSelect({
  selectedTags,
  setSelectedTags,
  autoCompleteOptions,
  onSelect,
}: TagsSelectProps) {
  return (
    <DropdownMenu>
      {selectedTags.length > 0 && (
        <div className="flex w-full flex-wrap items-center gap-1 rounded-md">
          {selectedTags.map((tag) => (
            <Button
              key={tag.id}
              variant="secondary"
              className="flex h-7 items-center gap-2 p-1.5 text-[0.8125rem]"
              onClick={() => {
                const newSelectedTags = selectedTags.filter(
                  (t) => t.id !== tag.id
                )
                setSelectedTags(newSelectedTags)
                onSelect && onSelect(newSelectedTags)
              }}
            >
              {tag.name}&nbsp;
              <Icons.Xmark className="size-4" />
            </Button>
          ))}
        </div>
      )}
      <DropdownMenuTrigger className="w-full rounded-md border px-4 py-2 text-start">
        Select a tag
      </DropdownMenuTrigger>
      {autoCompleteOptions.length > 0 && (
        <DropdownMenuContent className="w-[320px]">
          {autoCompleteOptions
            .filter((option) => {
              return !selectedTags.map((tag) => tag.id).includes(option.id)
            })
            .map((option) => (
              <DropdownMenuItem
                key={option.id}
                onSelect={() => {
                  const newSelectedTags = [...selectedTags, option]
                  setSelectedTags(newSelectedTags)
                  onSelect && onSelect(newSelectedTags)
                }}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
