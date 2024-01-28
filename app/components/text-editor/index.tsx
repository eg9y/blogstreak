"use client";

import "./editor.css";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./toolbar";
import { Button } from "@/app/components/button";
import { Badge } from "@/app/components/badge";
import { createClient } from "@/utils/supabase/client";
import { useSubmitPost } from "@/utils/hooks/use-submit-post";

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
  }),
];

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class: "prose dark:prose-invert prose-sm m-5 focus:outline-none",
    },
  },
};

export const TextEditor = () => {
  const supabase = createClient();
  const editor = useEditor({ extensions, content: "", ...editorOptions });
  const submitPostMutation = useSubmitPost();

  async function submitPost() {
    const content = JSON.stringify(editor?.getJSON());
    submitPostMutation.mutate(content);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className=" w-full rounded-md bg-white p-2 ring-1 ring-slate-500 dark:bg-slate-800 dark:ring-slate-500 ">
        <Toolbar editor={editor} />
        <div className="h-[20vh] overflow-y-scroll ">
          <EditorContent editor={editor} />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Badge className="cursor-pointer" color="red">
              Workout
            </Badge>
            <Badge className="cursor-pointer" color="orange">
              Full-time job
            </Badge>
            <Badge className="cursor-pointer" color="blue">
              Thoughts
            </Badge>
          </div>
          <Button color="orange" className="w-40 self-end" onClick={submitPost}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
