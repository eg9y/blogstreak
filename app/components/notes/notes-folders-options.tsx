"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { Database } from "@/schema";
import { useDeleteNotesFolder } from "@/utils/hooks/mutation/notes/use-delete-notes-folder";
import {
  NOTES_FOLDERS_QUERY_KEY,
  NOTES_QUERY_KEY,
} from "@/constants/query-keys";

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../dropdown";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";

export function NotesFolderOptions({
  noteFolder,
}: {
  noteFolder: Database["public"]["Tables"]["notes_folders"]["Row"];
}) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const deleteNotesFolderMutation = useDeleteNotesFolder();
  const queryClient = useQueryClient();

  return (
    <>
      <Dropdown>
        <DropdownButton
          className="h-5 w-10 cursor-pointer md:size-8 md:p-0"
          plain
          aria-label="Account options"
        >
          <DotsHorizontalIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem
            onClick={() => {
              setIsOpenDelete(true);
            }}
            color="red"
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dialog open={isOpenDelete} onClose={setIsOpenDelete} className="z-[52]">
        <DialogTitle>Delete folder?</DialogTitle>
        <DialogDescription>
          This can’t be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from search results.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDelete(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteNotesFolderMutation.mutate(noteFolder.id, {
                onSuccess: async () => {
                  setIsOpenDelete(false);
                  await queryClient.invalidateQueries({
                    queryKey: [NOTES_FOLDERS_QUERY_KEY],
                  });
                  return queryClient.invalidateQueries({
                    queryKey: [NOTES_QUERY_KEY, noteFolder.id],
                  });
                },
              });
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
