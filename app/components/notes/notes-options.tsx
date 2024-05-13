"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { Database } from "@/schema";
import { useDeletePost } from "@/utils/hooks/mutation/use-delete-post";

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
  const submitPostMutation = useDeletePost();
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
                onSuccess() {
                  setIsOpenDelete(false);
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
