"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { UseMutationResult } from "@tanstack/react-query";
import { Scrollbar } from "react-scrollbars-custom";

import { useGetJournalQuery } from "@/utils/hooks/query/journal/use-get-journal";
import { useUser } from "@/utils/getUser";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { Database } from "@/schema";
import { Button } from "@/app/components/button";
import { extensions } from "@/utils/textEditor";

import { BadgeButton } from "../../badge";
import { IsPublicSwitch } from "../is-public-switch";
import { Toolbar } from "../toolbar";
import { AddTagDialog } from "../dialog/add-tag-dialog";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert max-w-full prose-sm m-5 focus:outline-none",
    },
  },
  editable: false,
};

export const JournalTextForm = ({
  journalId,
  mutation,
}: {
  journalId?: number;
  mutation: UseMutationResult<void, Error, any, unknown>;
}) => {
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
  const { data: postData } = useGetJournalQuery(loggedInUser, journalId);
  const editor = useEditor({ extensions, ...editorOptions });

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
      if (editor) {
        editor.setEditable(true);
      }
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
    const rawText = editor?.getText() || "";
    const payload: {
      journalId?: number;
      content: string;
      rawText: string;
      tags: {
        id: number;
        name: string;
      }[];
      isPublic: boolean;
    } = {
      content,
      rawText,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      isPublic,
    };

    if (journalId) {
      payload.journalId = journalId;
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Your post has been saved!", {
          position: "top-center",
        });
        setLoadingEdit(false);
      },
      onError: (error) => {
        console.log("error!", error);
        toast.error("Error saving your post", {
          position: "top-center",
        });
        setLoadingEdit(false);
      },
    });
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
      <div className="flex grow flex-col pt-4">
        <div className="flex w-full grow flex-col border border-x-0 border-b-0 border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-transparent md:rounded-md md:border-x md:border-b ">
          <Toolbar editor={editor} />

          <div
            className="grow cursor-text"
            ref={editorContainerRef}
            // Make the div focusable
            tabIndex={0}
          >
            <Scrollbar
              className=""
              height="100%"
              // Make the div focusable
            >
              <EditorContent editor={editor} />
            </Scrollbar>
          </div>
        </div>
      </div>
      <div className="z-[100]">
        <div className="flex flex-col justify-evenly gap-1 border-t border-t-slate-300 bg-[hsl(0_0%_100%)] p-4 dark:border-slate-700 dark:bg-[hsl(240_10%_3.9%)] md:h-[100px] md:border-t-0">
          <div className="flex  justify-between">
            <div className="flex flex-wrap items-center gap-1">
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
                  {data?.map((topic: any) => {
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
                  <IsPublicSwitch
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                  />
                </>
              )}
            </div>
            <Button
              color="orange"
              className="w-40 cursor-pointer self-end"
              onClick={editPost}
              disabled={loadingEdit}
            >
              Save
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
