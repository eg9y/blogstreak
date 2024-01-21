"use client";

import "./editor.css";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  EditorContent,
  EditorOptions,
  EditorProvider,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Toolbar } from "./toolbar";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      HTMLAttributes: {
        class: "",
      },
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      HTMLAttributes: {
        class: "",
      },
    },
    heading: {
      HTMLAttributes: {
        // class: "leading-3",
      },
    },
    code: {
      HTMLAttributes: {
        // class: "bg-slate-50 text-slate-600",
      },
    },
  }),
];

const content = `
<h2>
  Hello World
</h2>
`;

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class: "prose dark:prose-invert prose-sm m-5 focus:outline-none",
    },
  },
};

export const TextEditor = () => {
  const editor = useEditor({
    extensions,
    content,
    ...editorOptions,
  });

  return (
    <div className="flex flex-col gap-1">
      <Toolbar editor={editor} />
      <div className="h-[20vh] w-full overflow-y-scroll rounded-md bg-white p-2 ring-1 ring-slate-500 dark:bg-slate-800 dark:ring-slate-500 ">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
