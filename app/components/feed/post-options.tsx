"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { Database } from "@/schema";
import { useDeleteJournal } from "@/utils/hooks/mutation/journal/use-delete-journal";
import { JOURNALS_QUERY_KEY, STREAKS_QUERY_KEY } from "@/constants/query-keys";
import { useUser } from "@/utils/getUser";

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownDivider,
} from "../dropdown";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";

export function PostOptions({
  post,
}: {
  post: Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number] & {
    streaks: number | null;
  };
}) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const { loggedInUser } = useUser();
  const submitPostMutation = useDeleteJournal(loggedInUser);

  const queryClient = useQueryClient();

  return (
    <>
      <Dropdown>
        <DropdownButton
          className=" size-10 cursor-pointer"
          plain
          aria-label="Account options"
        >
          <DotsHorizontalIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem href={`/me/journal/${post.post_id}/edit`}>
            Edit
          </DropdownItem>
          <DropdownDivider />
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
              submitPostMutation.mutate(post.post_id, {
                async onSuccess() {
                  setIsOpenDelete(false);
                  await queryClient.invalidateQueries({
                    queryKey: [STREAKS_QUERY_KEY],
                  });
                  return queryClient.invalidateQueries({
                    queryKey: [JOURNALS_QUERY_KEY],
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
