"use client"

import { Editor, EditorContent } from "@tiptap/react"

import { Icons } from "@/components/icons"

type MarkdownProps = {
  editor: Editor
}

export function Markdown({ editor }: MarkdownProps) {
  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent className="unreset outline-none" editor={editor} />
    </>
  )
}

export function Toolbar({ editor }: MarkdownProps) {
  return (
    <div className="flex flex-nowrap items-center gap-2 [&_button]:grid [&_button]:size-8 [&_button]:place-content-center [&_button]:rounded-md [&_button]:border [&_button]:p-1 [&_button]:disabled:bg-background/40">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Icons.Undo className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Icons.Redo className="size-5" />
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.Bold className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.Italic className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.Strikethrough className="size-5" />
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        P
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        h2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        h3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={
          editor.isActive("heading", { level: 4 })
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        h4
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.BulletList className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.OrderedList className="size-5" />
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.Code className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "bg-primary font-bold text-primary-foreground"
            : ""
        }
      >
        <Icons.Quote className="size-5" />
      </button>
    </div>
  )
}
