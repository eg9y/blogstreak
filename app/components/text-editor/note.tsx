"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Scrollbar } from "react-scrollbars-custom";
import { useQueryClient } from "@tanstack/react-query";

import { extensions } from "@/utils/textEditor";
import { useUser } from "@/utils/getUser";
import { Button } from "@/app/components/button";
import { useNotesStore } from "@/store/notes";
import { useGetNoteQuery } from "@/utils/hooks/query/notes/use-get-note";
import { useEditNotes } from "@/utils/hooks/mutation/notes/use-edit-notes";

import { Toolbar } from "./toolbar";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm m-5 prose-p:!text-xs  focus:outline-none max-w-full",
    },
  },
  editable: true,
};

export const NoteEditor = () => {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const editorContainerRef = useRef(null);
  const queryClient = useQueryClient();

  const editor = useEditor({ extensions, content: "", ...editorOptions });
  const { loggedInUser } = useUser();
  const notesStore = useNotesStore();
  const submitNoteMutation = useEditNotes(
    loggedInUser,
    notesStore.selectedNote ? notesStore.selectedNote.id : null,
  );
  const { data: noteData } = useGetNoteQuery(
    loggedInUser,
    notesStore.selectedNote?.id,
  );

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
    if (!editor) {
      return;
    } else if (!noteData?.data?.content) {
      editor.commands.clearContent();
      return;
    }
    editor.commands.setContent(JSON.parse(noteData.data.content));
    editor.setEditable(true);
  }, [noteData, editor]);

  function submitNote() {
    if (!loggedInUser) {
      toast.error("Current User not loaded");
      return;
    }
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    submitNoteMutation.mutate(
      {
        content,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["notes", notesStore.selectedFolder?.id],
          });
          toast.success("Your note has been edited!", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
        onError: () => {
          toast.error("Error editing your note", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
      },
    );
  }

  return (
    <div className=" flex grow flex-col border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-transparent ">
      <Toolbar editor={editor} />
      <div
        className="grow cursor-text"
        ref={editorContainerRef}
        // Make the div focusable
        tabIndex={0}
      >
        <Scrollbar height="65vh">
          <EditorContent editor={editor} />
        </Scrollbar>
      </div>
      <div className="flex items-center justify-between">
        <Button
          color="orange"
          className="w-40 cursor-pointer self-end"
          onClick={submitNote}
          disabled={loadingEdit}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
