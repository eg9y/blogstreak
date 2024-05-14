"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

import { extensions } from "@/utils/textEditor";
import { useUser } from "@/utils/getUser";
import { useNotesStore } from "@/store/notes";
import { useGetNoteQuery } from "@/utils/hooks/query/notes/use-get-note";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/utils/utils";

import { Toolbar } from "./toolbar";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm m-5 prose-p:!text-xs focus:outline-none max-w-full",
    },
  },
  editable: false,
};

export const NoteEditor = () => {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { loggedInUser } = useUser();
  const notesStore = useNotesStore();
  const { data: noteData } = useGetNoteQuery(
    loggedInUser,
    notesStore.selectedNote?.id,
  );
  const supabase = createClient();

  const updateNote = useDebouncedCallback(async (editor) => {
    if (!loggedInUser) {
      return;
    }
    if (!noteData?.data) {
      return;
    }
    console.log("testerino", noteData);

    const content = JSON.stringify(editor.getJSON());

    const { error: notesUpdateError } = await supabase
      .from("notes")
      .update({
        content,
      })
      .eq("user_id", loggedInUser.id)
      .eq("id", noteData?.data.id)
      .select()
      .single();

    if (notesUpdateError) {
      toast.error("Error updating note");
      return;
    }
    setLoadingEdit(false);
  }, 2000);

  const setLoadingEditState = useDebouncedCallback(() => {
    setLoadingEdit(true);
  }, 1000);

  const editor = useEditor({
    extensions,
    content: "",
    ...editorOptions,
    onUpdate({ editor: currEditor }) {
      setLoadingEditState();
      updateNote(currEditor);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    } else if (!noteData?.data?.content) {
      editor.commands.clearContent();
      return;
    }
    if (editor && noteData?.data?.content) {
      editor.commands.setContent(JSON.parse(noteData.data.content));
      editor.setEditable(true);
    }
  }, [editor, noteData]);

  return (
    <div className="flex grow flex-col border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-transparent">
      <Toolbar editor={editor} />
      <div className="grow cursor-text" tabIndex={0}>
        <Scrollbar height="65vh">
          <EditorContent editor={editor} />
        </Scrollbar>
      </div>
      <div
        className={cn(
          "flex items-center justify-end gap-1 transition-opacity dark:text-slate-300",
          loadingEdit ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="text-xs">Saving note...</p>
        <LoaderIcon size={14} className={cn("animate-spin ")} />
      </div>
    </div>
  );
};
