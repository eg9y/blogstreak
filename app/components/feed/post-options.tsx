import { useState } from "react";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "../dropdown";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { Database } from "@/schema";
import { useDeletePost } from "@/utils/hooks/use-delete-post";
import Link from "next/link";
import { toast } from "sonner";

export function PostOptions({
  post,
}: {
  post: Database["public"]["Tables"]["posts"]["Row"];
}) {
  let [isOpenDelete, setIsOpenDelete] = useState(false);
  const submitPostMutation = useDeletePost();

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
          <DropdownItem href={`/app/post/${post.id}/edit`}>Edit</DropdownItem>
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
              submitPostMutation.mutate(post.id, {
                onSuccess() {
                  console.log("nice!");
                  setIsOpenDelete(false);
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
