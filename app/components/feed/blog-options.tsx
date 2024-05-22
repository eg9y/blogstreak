"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { Database } from "@/schema";
import { useDeleteJournal } from "@/utils/hooks/mutation/journal/use-delete-journal";

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "../dropdown";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";

export function BlogOptions({
  blog,
}: {
  blog: Database["public"]["Functions"]["get_blogs"]["Returns"][number];
}) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const submitPostMutation = useDeleteJournal();
  const queryClient = useQueryClient();

  return (
    <>
      <Dropdown>
        <DropdownButton
          className="h-5 w-10 cursor-pointer md:size-10"
          plain
          aria-label="Account options"
        >
          <DotsHorizontalIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem href={`/me/blog/${blog.id}/edit`}>Edit</DropdownItem>
          <DropdownSeparator />
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
        <DialogTitle>Delete post?</DialogTitle>
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
              submitPostMutation.mutate(blog.id, {
                async onSuccess() {
                  setIsOpenDelete(false);
                  await queryClient.invalidateQueries({
                    queryKey: ["streaks"],
                  });
                  return queryClient.invalidateQueries({
                    queryKey: ["journal"],
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
