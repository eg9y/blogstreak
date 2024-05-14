"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { Database } from "@/schema";
import { useDeleteNotes } from "@/utils/hooks/mutation/notes/use-delete-notes";

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

export function NotesOptions({
  note,
}: {
  note: Database["public"]["Functions"]["get_notes"]["Returns"][number];
}) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const submitPostMutation = useDeleteNotes();
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
        <DialogTitle>Delete note?</DialogTitle>
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
              submitPostMutation.mutate(note.id, {
                onSuccess() {
                  setIsOpenDelete(false);
                  return queryClient.invalidateQueries({
                    queryKey: ["notes-folders"],
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
