"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CornerDownRightIcon,
  FilePlusIcon,
  FolderPlusIcon,
  LoaderIcon,
  SidebarCloseIcon,
} from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

import { Button } from "@/app/components/button";
import { useUsername } from "@/app/components/subdomain-context";
import { useUser } from "@/utils/getUser";
import { useCreateNotesFolder } from "@/utils/hooks/mutation/notes/use-create-notes-folder";
import { useGetNotesFolders } from "@/utils/hooks/query/notes/use-get-notes-folders";
import { useNotesStore } from "@/store/notes";
import { CreateFolderDialog } from "@/app/components/notes/create-folder-dialog";
import { CreateNotesDialog } from "@/app/components/notes/create-notes-dialog";
import { useCreateNotes } from "@/utils/hooks/mutation/notes/use-create-notes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/ui/resizable";
import { cn } from "@/utils/utils";
import { NoteEditor } from "@/app/components/text-editor/note";
import { NotesOptions } from "@/app/components/notes/notes-options";
import { NotesFolderOptions } from "@/app/components/notes/notes-folders-options";
import { useGetNotesInFolder } from "@/utils/hooks/query/notes/use-get-notes-in-folder";

export default function Notes() {
  const createNotesFolderMutation = useCreateNotesFolder();
  const [isOpenCreateFolder, setIsOpenCreateFolder] = useState(false);
  const [isOpenCreateNotes, setIsOpenCreateNotes] = useState(false);
  const [notesName, setNotesName] = useState("");
  const [folderName, setFolderName] = useState("");
  const { loggedInUser } = useUser();
  const username = useUsername();
  const queryClient = useQueryClient();
  const notesStore = useNotesStore();
  const createNotesMutation = useCreateNotes(
    notesStore.selectedFolder ? notesStore.selectedFolder.id : null,
  );
  const getNotesFoldersQuery = useGetNotesFolders(loggedInUser, username);
  const getNotesInFolderQuery = useGetNotesInFolder(
    notesStore.selectedFolder?.id || null,
  );

  const [isCollapseFolderTab, setIsCollapseFolderTab] = useState(false);

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
      },
      {
        onSuccess() {
          setIsOpenCreateNotes(false);
          setNotesName("");
          return queryClient.invalidateQueries({
            queryKey: ["notes-in-folder", notesStore.selectedFolder?.id],
          });
        },
      },
    );
  }

  const defaultLayout = [265, 440, 655];

  const folderCollapsePanelRef = useRef<ImperativePanelHandle>(null);

  const collapsePanel = () => {
    const panel = folderCollapsePanelRef.current;
    if (panel) {
      if (panel.isCollapsed()) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  };

  return (
    <>
      <div className="flex grow flex-col gap-2 ">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="persistence"
          className="grow"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={2}
            collapsible={true}
            minSize={14}
            maxSize={24}
            ref={folderCollapsePanelRef}
            onCollapse={() => {
              setIsCollapseFolderTab(true);
            }}
            onExpand={() => {
              setIsCollapseFolderTab(false);
            }}
            className={cn(
              "flex flex-col",
              isCollapseFolderTab
                ? "transition-all duration-300 ease-in-out"
                : "gap-1 px-2 ",
            )}
          >
            {!isCollapseFolderTab && (
              <div className="flex w-full items-center gap-1">
                <Button
                  outline
                  className={" cursor-pointer !p-1"}
                  onClick={() => collapsePanel()}
                >
                  <SidebarCloseIcon size={14} />
                </Button>

                <Button
                  className={cn("grow cursor-pointer")}
                  outline
                  onClick={() => setIsOpenCreateFolder(true)}
                >
                  <FolderPlusIcon size={14} />
                </Button>
                <Button
                  className="grow cursor-pointer"
                  outline
                  onClick={() => setIsOpenCreateNotes(true)}
                >
                  <FilePlusIcon size={14} />
                </Button>
              </div>
            )}
            {!isCollapseFolderTab && (
              <div className={cn("flex h-full flex-col gap-1 overflow-auto")}>
                {(getNotesFoldersQuery.isLoading ||
                  getNotesFoldersQuery.isFetching) &&
                  !notesStore.selectedFolder && (
                    <div className="flex w-full items-center justify-center">
                      <LoaderIcon size={20} className="animate-spin" />
                    </div>
                  )}

                {getNotesFoldersQuery.isSuccess &&
                  getNotesFoldersQuery.data &&
                  getNotesFoldersQuery.data.folders.map((folder) => (
                    <div className="flex flex-col gap-1" key={folder.id}>
                      <div
                        className={cn(
                          "flex w-full justify-between rounded-md border border-slate-700",
                          notesStore.selectedFolder?.id === folder.id
                            ? "bg-slate-300  dark:bg-slate-900"
                            : "font-medium",
                        )}
                      >
                        <button
                          className={"flex grow items-center justify-start p-2"}
                          onClick={() => {
                            notesStore.setSelectedFolder({
                              id: folder.id,
                              name: folder.name,
                            });
                            const existing = new Set(
                              notesStore.openedFolderIds,
                            );
                            if (existing.has(folder.id)) {
                              existing.delete(folder.id);
                            } else {
                              existing.add(folder.id);
                            }
                            notesStore.setOpenedFolderIds(Array.from(existing));
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate text-start text-sm tracking-tight">
                              {folder.name}
                            </span>
                            {(getNotesInFolderQuery.isLoading ||
                              getNotesInFolderQuery.isFetching) &&
                              notesStore.selectedFolder?.id === folder.id && (
                                <div className="flex items-center justify-center">
                                  <LoaderIcon
                                    size={12}
                                    className="animate-spin text-slate-400"
                                  />
                                </div>
                              )}
                          </div>
                        </button>
                        <NotesFolderOptions noteFolder={folder} />
                      </div>
                      <div className="flex flex-col">
                        {folder.id === notesStore.selectedFolder?.id &&
                          getNotesInFolderQuery.data?.notes.map((file) => (
                            <div
                              key={file.id}
                              className={cn(
                                "ml-4 flex items-center rounded-md",
                                notesStore.selectedNote?.id === file.id &&
                                  "dark:bg-slate-800",
                              )}
                            >
                              <button
                                className={cn("flex h-full grow items-center")}
                                onClick={() => {
                                  notesStore.setSelectedNote({
                                    id: file.id,
                                    name: file.title,
                                  });
                                }}
                              >
                                <span>
                                  <CornerDownRightIcon
                                    size={14}
                                    className="mb-1"
                                  />
                                </span>
                                <span className="text-start text-xs">
                                  {file.title}
                                </span>
                              </button>
                              <NotesOptions note={file} />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {isCollapseFolderTab && (
              <button
                className="flex size-full items-center justify-center transition-all hover:bg-slate-100 dark:bg-slate-800"
                onClick={() => {
                  collapsePanel();
                }}
              >
                <DotsVerticalIcon scale={2} />
              </button>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel className="relative flex grow flex-col">
            {notesStore.selectedNote && <NoteEditor />}
          </ResizablePanel>
        </ResizablePanelGroup>
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
