"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "sonner";

import { extensions } from "@/utils/textEditor";
import { useCreateBio } from "@/utils/hooks/mutation/use-create-bio";
import { useUser } from "@/utils/getUser";
import { Button } from "@/app/components/button";
import { useGetBioQuery } from "@/utils/hooks/query/use-get-bio";
import { useGetUsernameQuery } from "@/utils/hooks/query/use-get-username";

import { Toolbar } from "./toolbar";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm m-5 focus:outline-none max-w-full",
    },
  },
  editable: true,
};

export const CreateBioEditor = () => {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const editorContainerRef = useRef(null);

  const editor = useEditor({ extensions, content: "", ...editorOptions });
  const { currentUser } = useUser();
  const submitBioMutation = useCreateBio();
  const { data: user } = useGetUsernameQuery(currentUser);
  const { data: postData } = useGetBioQuery(user ? user : undefined);

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

  useEffect(() => {
    if (!postData?.data?.bio || !editor) {
      return;
    }
    editor.commands.setContent(JSON.parse(postData.data.bio));
    editor.setEditable(true);
  }, [postData, editor]);

  function submitPost() {
    if (!currentUser) {
      toast.error("Current User not loaded");
      return;
    }
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    submitBioMutation.mutate(
      {
        content,
        userId: currentUser.id,
      },
      {
        onSuccess: () => {
          toast.success("Your bio has been created!", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
        onError: () => {
          toast.error("Error creating your bio", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
      },
    );
  }

  return (
    <>
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
          <div className="flex items-center justify-between">
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
    </>
  );
};
