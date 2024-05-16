"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";

import { Button } from "@/app/components/button";
import { useCreatePost } from "@/utils/hooks/mutation/use-create-post";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { useUser } from "@/utils/getUser";
import { Database } from "@/schema";
import { extensions } from "@/utils/textEditor";

import { BadgeButton } from "../badge";

import { Toolbar } from "./toolbar";
import { AddTagDialog } from "./dialog/add-tag-dialog";
import { IsPublicSwitch } from "./is-public-switch";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm m-5 focus:outline-none max-w-full",
    },
  },
  editable: true,
};

export const CreateTextEditor = () => {
  const [tags, setTags] = useState(
    [] as Database["public"]["Tables"]["topics"]["Row"][],
  );
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const editorContainerRef = useRef(null);

  const editor = useEditor({ extensions, content: "", ...editorOptions });
  const submitPostMutation = useCreatePost();

  const { loggedInUser } = useUser();
  const { data, isLoading, isSuccess } = useGetTopicsQuery(loggedInUser);

  useEffect(() => {
    // Step 3: Add an event listener to focus the editor
    const handleFocus = () => {
      if (editor && editor.isEditable) {
        editor.commands.focus();
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
  }, [editor]);

  function submitPost() {
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    const rawText = editor?.getText() || "";
    submitPostMutation.mutate(
      {
        content,
        rawText,
        tagIds: tags.map((tag) => tag.id),
        isPublic,
      },
      {
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
      },
    );
  }

  function tagClick(tag: Database["public"]["Tables"]["topics"]["Row"]) {
    const exist = tags.find((current) => current.id === tag.id);

    if (exist) {
      const newTags = [...tags].filter((current) => current.id !== tag.id);
      setTags(newTags);
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className=" w-full rounded-md bg-white p-2 ring-1 ring-slate-300 dark:bg-transparent dark:ring-slate-700 ">
          <Toolbar editor={editor} />
          <div
            className="h-full cursor-text"
            ref={editorContainerRef}
            // Make the div focusable
            tabIndex={0}
          >
            <Scrollbar
              style={{
                height: "65vh",
              }}
            >
              <EditorContent editor={editor} />
            </Scrollbar>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex gap-1">
                <BadgeButton
                  className="cursor-pointer"
                  color={"green"}
                  onClick={() => {
                    setOpenAddTagDialog(true);
                  }}
                >
                  <PlusIcon />
                  New Tag
                </BadgeButton>
                {isLoading && "Loading topics"}
                {isSuccess && data?.length === 0 && (
                  <p className="text-sm text-slate-600">No Tags</p>
                )}
                {isSuccess &&
                  data?.map((topic) => {
                    return (
                      <BadgeButton
                        className="cursor-pointer"
                        key={topic.name}
                        color={
                          tags.find((tag) => tag.name === topic.name)
                            ? (topic.color as any)
                            : undefined
                        }
                        onClick={() => {
                          tagClick(topic);
                        }}
                      >
                        {topic.name}
                      </BadgeButton>
                    );
                  })}
              </div>
              <IsPublicSwitch isPublic={isPublic} setIsPublic={setIsPublic} />
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

      <AddTagDialog
        openAddTagDialog={openAddTagDialog}
        setOpenAddTagDialog={setOpenAddTagDialog}
      />
    </>
  );
};
