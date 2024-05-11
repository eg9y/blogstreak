"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/app/components/button";
import { useUsername } from "@/app/components/subdomain-context";
import { useUser } from "@/utils/getUser";
import { useCreateNotesFolder } from "@/utils/hooks/mutation/notes/use-create-notes-folder";
import { useGetNotesFolders } from "@/utils/hooks/query/notes/use-get-notes-folders";
import { useNotesStore } from "@/store/notes";
import { useGetNotes } from "@/utils/hooks/query/notes/use-get-notes";
import { CreateFolderDialog } from "@/app/components/notes/create-folder-dialog";
import { CreateNotesDialog } from "@/app/components/notes/create-notes-dialog";
import { useCreateNotes } from "@/utils/hooks/mutation/notes/use-create-notes";

export default function Notes() {
  const createNotesFolderMutation = useCreateNotesFolder();
  const [isOpenCreateFolder, setIsOpenCreateFolder] = useState(false);
  const [isOpenCreateNotes, setIsOpenCreateNotes] = useState(false);
  const [notesName, setNotesName] = useState("");
  const [folderName, setFolderName] = useState("");
  const { loggedInUser } = useUser();
  const username = useUsername();
  const getNotesFoldersQuery = useGetNotesFolders(loggedInUser, username);
  const queryClient = useQueryClient();
  const notesStore = useNotesStore();
  const getNotesQuery = useGetNotes(loggedInUser, notesStore.selectedFolderId);
  const createNotesMutation = useCreateNotes(username);

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
            queryKey: ["notes-folders", username],
          });
        },
      },
    );
  }

  function createNotes() {
    createNotesMutation.mutate(
      {
        title: notesName,
        notesFolderId: notesStore.selectedFolderId,
      },
      {
        onSuccess() {
          setIsOpenCreateNotes(false);
          setNotesName("");
          return queryClient.invalidateQueries({
            queryKey: ["notes", username],
          });
        },
      },
    );
  }

  useEffect(() => {
    if (
      !getNotesFoldersQuery.data ||
      getNotesFoldersQuery.data.data.length === 0
    ) {
      return;
    }
    notesStore.setSelectedFolderId(getNotesFoldersQuery.data.data[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNotesFoldersQuery.isSuccess, getNotesFoldersQuery.data]);

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
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => {
                        notesStore.setSelectedFolderId(folder.id);
                      }}
                      {...(notesStore.selectedFolderId === folder.id
                        ? {
                            color: "dark/white",
                          }
                        : { plain: true })}
                    >
                      {folder.name}
                    </Button>
                  </div>
                );
              })}
          </div>
          <div className="grow px-2">
            <Button
              className="w-full cursor-pointer"
              outline
              onClick={() => setIsOpenCreateNotes(true)}
            >
              +
            </Button>
            {getNotesQuery.data?.pages.map((page) => {
              return page.data.map((note) => {
                return <div key={note.id}>{note.title}</div>;
              });
            })}
          </div>
        </div>
      </div>

      <CreateFolderDialog
        isOpenCreateFolder={isOpenCreateFolder}
        setIsOpenCreateFolder={setIsOpenCreateFolder}
        setFolderName={setFolderName}
        createFolder={createFolder}
      />
      <CreateNotesDialog
        isOpenCreateNotes={isOpenCreateNotes}
        setIsOpenCreateNotes={setIsOpenCreateNotes}
        createNotes={createNotes}
        setNotesName={setNotesName}
      />
    </>
  );
}
