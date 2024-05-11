"use client";

import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";

import { Button } from "@/app/components/button";
import { useUsername } from "@/app/components/subdomain-context";
import { useUser } from "@/utils/getUser";
import { useCreateNotesFolder } from "@/utils/hooks/mutation/notes/use-create-notes-folder";
import { useGetNotesFolders } from "@/utils/hooks/query/notes/use-get-notes-folders";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/app/components/dialog";
import { Input } from "@/app/components/input";
import { Description, Field, Label } from "@/app/components/fieldset";

export default function Notes() {
  const createNotesFolderMutation = useCreateNotesFolder();
  const [isOpenCreateFolder, setIsOpenCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { loggedInUser } = useUser();
  const username = useUsername();
  const getNotesFoldersQuery = useGetNotesFolders(loggedInUser, username);
  const queryClient = new QueryClient();

  function createFolder() {
    createNotesFolderMutation.mutate(
      {
        name: folderName,
      },
      {
        onSuccess() {
          setIsOpenCreateFolder(false);
          setFolderName("");
          return queryClient.invalidateQueries({
            queryKey: ["journal"],
          });
        },
      },
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="flex grow">
          <div className="flex w-40 flex-col gap-2 border-r border-slate-300 px-2">
            <Button
              className="w-full cursor-pointer"
              outline
              onClick={() => setIsOpenCreateFolder(true)}
            >
              +
            </Button>
            {getNotesFoldersQuery.isSuccess &&
              getNotesFoldersQuery.data &&
              getNotesFoldersQuery.data.data.map((folder) => {
                return (
                  <div className="" key={folder.id}>
                    <Button className="w-full cursor-pointer" plain>
                      {folder.name}
                    </Button>
                  </div>
                );
              })}
          </div>
          <div className="grow"></div>
        </div>
      </div>

      <Dialog
        open={isOpenCreateFolder}
        onClose={setIsOpenCreateFolder}
        className="z-[52]"
      >
        <DialogTitle>New Folder</DialogTitle>
        <DialogBody>
          <Field>
            <Label>Name</Label>
            <Input
              onChange={(event) => setFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  createFolder();
                }
              }}
            />
            <Description>You can leave blank</Description>
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenCreateFolder(false)}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              createFolder();
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
