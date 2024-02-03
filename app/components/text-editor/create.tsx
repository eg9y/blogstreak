"use client";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";
import { Toolbar } from "./toolbar";
import { Button } from "@/app/components/button";
import { useSubmitPost } from "@/utils/hooks/use-submit-post";
import { BadgeButton } from "../badge";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

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
  editable: true,
};

export const CreateTextEditor = () => {
  const [tags, setTags] = useState([] as string[]);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const editorContainerRef = useRef(null); // Step 1: Create a ref for the parent div

  const editor = useEditor({ extensions, content: "", ...editorOptions });
  const submitPostMutation = useSubmitPost();

  useEffect(() => {
    // Step 3: Add an event listener to focus the editor
    const handleFocus = () => {
      if (editor && editor.isEditable) {
        editor.commands.focus(); // Focus the editor
      }
    };

    const editorContainer = editorContainerRef.current;
    if (editorContainer) {
      (editorContainer as any).addEventListener("focus", handleFocus, true);
    }

    // Cleanup the event listener
    return () => {
      if (editorContainer) {
        (editorContainer as any).removeEventListener(
          "focus",
          handleFocus,
          true,
        );
      }
    };
  }, [editor]); // Dependency array to re-run effect if the editor instance changes

  async function submitPost() {
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    submitPostMutation.mutate(content, {
      onSuccess: () => {
        toast.success("Your post has been created!", {
          position: "top-center",
        });
        setLoadingEdit(false);
      },
      onError: () => {
        toast.error("Error creating your post", {
          position: "top-center",
        });
        setLoadingEdit(false);
      },
    });
  }

  function tagClick(tagName: string) {
    const tagsSet = new Set(tags);
    if (tagsSet.has(tagName)) {
      tagsSet.delete(tagName);
    } else {
      tagsSet.add(tagName);
    }

    setTags(Array.from(tagsSet));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className=" w-full rounded-md bg-white p-2 ring-1 ring-slate-300 dark:bg-slate-800 dark:ring-slate-500 ">
        <Toolbar editor={editor} />
        <div
          className="h-[65vh] cursor-text overflow-y-scroll"
          ref={editorContainerRef} // Step 2: Attach the ref to the parent div
          tabIndex={0} // Make the div focusable
          onClick={() => {}}
        >
          <EditorContent editor={editor} />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1">
            <BadgeButton
              className="cursor-pointer"
              color={tags.includes("workout") ? "red" : undefined}
              onClick={() => {
                tagClick("workout");
              }}
            >
              Workout
            </BadgeButton>
            <BadgeButton
              className="cursor-pointer"
              color={tags.includes("full-time_job") ? "orange" : undefined}
              onClick={() => {
                tagClick("full-time_job");
              }}
            >
              Full-time job
            </BadgeButton>
            <BadgeButton
              className="cursor-pointer"
              color={tags.includes("thoughts") ? "blue" : undefined}
              onClick={() => {
                tagClick("thoughts");
              }}
            >
              Thoughts
            </BadgeButton>
            <BadgeButton
              className="cursor-pointer"
              color={"green"}
              onClick={() => {
                tagClick("thoughts");
              }}
            >
              <PlusIcon />
              New Tag
            </BadgeButton>
          </div>
          <Button
            color="orange"
            className="w-40 cursor-pointer self-end"
            onClick={submitPost}
            disabled={loadingEdit}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
