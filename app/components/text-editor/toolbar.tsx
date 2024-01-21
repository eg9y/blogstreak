import { cn } from "@/utils/cn";
import "./editor.css";
import { Editor } from "@tiptap/react";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="sticky flex w-full flex-wrap gap-1 rounded-md bg-slate-100 p-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("bold") ? "bg-yellow-100" : "",
        )}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("italic") ? "bg-yellow-100" : "",
        )}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("strike") ? "bg-yellow-100" : "",
        )}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("code") ? "bg-yellow-100" : "",
        )}
      >
        code
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("heading", { level: 1 }) ? "bg-yellow-100" : "",
        )}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("heading", { level: 2 }) ? "bg-yellow-100" : "",
        )}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("heading", { level: 3 }) ? "bg-yellow-100" : "",
        )}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("heading", { level: 4 }) ? "bg-yellow-100" : "",
        )}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("heading", { level: 5 }) ? "bg-yellow-100" : "",
        )}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("heading", { level: 6 }) ? "bg-yellow-100" : "",
        )}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("bulletList") ? "bg-yellow-100" : "",
        )}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("orderedList") ? "bg-yellow-100" : "",
        )}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("codeBlock") ? "bg-yellow-100" : "",
        )}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("blockquote") ? "bg-yellow-100" : "",
        )}
      >
        blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={cn(
          "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500",
          editor.isActive("paragraph") ? "bg-yellow-100" : "",
        )}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" })
            ? "bg-yellow-100"
            : ""
        }
      >
        purple
      </button>
    </div>
  );
};
