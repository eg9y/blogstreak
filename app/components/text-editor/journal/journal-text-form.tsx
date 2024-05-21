"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import Sticky from "react-sticky-el";
import { useMediaQuery } from "react-responsive";
import { UseMutationResult } from "@tanstack/react-query";

import { useGetPostQuery } from "@/utils/hooks/query/use-get-post";
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
  const { data: postData } = useGetPostQuery(loggedInUser, journalId);
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
      tags: number[];
      isPublic: boolean;
    } = {
      content,
      rawText,
      tags: tags.map((tag) => tag.id),
      isPublic,
    };

    if (journalId) {
      payload.journalId = journalId;
    }

    console.log("payload", payload);
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

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  return (
    <>
      <div className="flex grow flex-col py-4">
        <div className="w-full grow border border-x-0 border-b-0 border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-transparent md:rounded-md md:border-x md:border-b ">
          {isDesktopOrLaptop && (
            <Sticky stickyClassName="z-[100]">
              <Toolbar editor={editor} />
            </Sticky>
          )}
          <div
            className="h-full cursor-text pb-[200px] md:pb-[100px]"
            ref={editorContainerRef}
            // Make the div focusable
            tabIndex={0}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
      <Sticky mode="bottom" stickyClassName="z-[100]">
        <div className="flex h-[200px] flex-col justify-evenly gap-1 border-t border-t-slate-300 bg-[hsl(0_0%_100%)] p-4 dark:border-slate-700 dark:bg-[hsl(240_10%_3.9%)] md:h-[100px] md:border-t-0">
          {!isDesktopOrLaptop && <Toolbar editor={editor} />}
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
              Edit
            </Button>
          </div>
        </div>
      </Sticky>
      <AddTagDialog
        openAddTagDialog={openAddTagDialog}
        setOpenAddTagDialog={setOpenAddTagDialog}
      />
    </>
  );
};
