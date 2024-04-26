"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import Scrollbar from "react-scrollbars-custom";

import { useGetPostQuery } from "@/utils/hooks/query/use-get-post";
import { useUser } from "@/utils/getUser";
import { useEditPost } from "@/utils/hooks/mutation/use-edit-post";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { Database } from "@/schema";
import { Button } from "@/app/components/button";
import { extensions } from "@/utils/textEditor";

import { BadgeButton } from "../badge";

import { IsPublicSwitch } from "./is-public-switch";
import { Toolbar } from "./toolbar";
import { AddTagDialog } from "./dialog/add-tag-dialog";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert max-w-full prose-sm m-5 focus:outline-none",
    },
  },
  editable: false,
};

export const EditTextEditor = ({ journalId }: { journalId: number }) => {
  const [tags, setTags] = useState(
    [] as Database["public"]["Tables"]["topics"]["Row"][],
  );

  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const editorContainerRef = useRef(null);

  const { loggedInUser } = useUser();
  const { data, isLoading, isSuccess } = useGetTopicsQuery(
    loggedInUser,
    journalId,
  );
  const { data: postData } = useGetPostQuery(loggedInUser, journalId);
  const editor = useEditor({ extensions, ...editorOptions });
  const editPostMutation = useEditPost();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const associatedTags = data.filter((tag: any) => {
      return tag.isSelected;
    });
    setTags(associatedTags);
  }, [data, isSuccess]);

  useEffect(() => {
    if (!postData?.data?.text || !editor) {
      return;
    }

    setIsPublic(postData.data.is_public);
    editor.commands.setContent(JSON.parse(postData.data.text));
    editor.setEditable(true);
  }, [postData, editor]);

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

  function editPost() {
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    editPostMutation.mutate(
      {
        journalId,
        content,
        tags,
        isPublic,
      },
      {
        onSuccess: () => {
          toast.success("Your post has been edited!", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
        onError: () => {
          toast.error("Error editing your post", {
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
    <div className="flex flex-col gap-2">
      <div className=" w-full rounded-md bg-white p-2 ring-1 ring-slate-300 dark:bg-slate-800 dark:ring-slate-700 ">
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
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
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
            {isSuccess && (
              <>
                {data?.map((topic) => {
                  return (
                    <BadgeButton
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
                <IsPublicSwitch isPublic={isPublic} setIsPublic={setIsPublic} />
              </>
            )}
          </div>
          <Button
            color="orange"
            className="w-40 cursor-pointer self-end"
            onClick={editPost}
            disabled={loadingEdit}
          >
            Submit Edit
          </Button>
        </div>
      </div>
      <AddTagDialog
        openAddTagDialog={openAddTagDialog}
        setOpenAddTagDialog={setOpenAddTagDialog}
      />
    </div>
  );
};
