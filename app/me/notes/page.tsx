"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FilePlusIcon,
  FolderPlusIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
} from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/ui/resizable";
import { cn } from "@/utils/utils";
import { NoteEditor } from "@/app/components/text-editor/note";
import { NotesOptions } from "@/app/components/notes/notes-options";
import { NotesFolderOptions } from "@/app/components/notes/notes-folders-options";

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
  const getNotesQuery = useGetNotes(
    loggedInUser,
    notesStore.selectedFolder ? notesStore.selectedFolder.id : null,
  );
  const createNotesMutation = useCreateNotes(
    notesStore.selectedFolder ? notesStore.selectedFolder.id : null,
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
            queryKey: ["notes", notesStore.selectedFolder?.id],
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
    notesStore.setSelectedFolder({
      id: getNotesFoldersQuery.data.data[0].id,
      name: getNotesFoldersQuery.data.data[0].name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNotesFoldersQuery.isSuccess, getNotesFoldersQuery.data]);

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
              </div>
            )}
            {!isCollapseFolderTab && (
              <div className={cn("flex h-full flex-col gap-1 overflow-auto")}>
                {getNotesFoldersQuery.isSuccess &&
                  getNotesFoldersQuery.data &&
                  getNotesFoldersQuery.data.data.map((folder) => {
                    return (
                      <div className="" key={folder.id}>
                        <Button
                          className={cn(
                            "w-full !justify-between ",
                            notesStore.selectedFolder?.id === folder.id
                              ? "bg-slate-300 hover:!bg-slate-300 dark:bg-slate-700 dark:hover:!bg-slate-700"
                              : "font-medium",
                          )}
                          plain
                          onClick={() => {
                            notesStore.setSelectedFolder({
                              id: folder.id,
                              name: folder.name,
                            });
                          }}
                        >
                          <span className="truncate text-start text-xs tracking-tight">
                            {folder.name}
                          </span>
                          <NotesFolderOptions noteFolder={folder} />
                        </Button>
                      </div>
                    );
                  })}
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

          <ResizablePanel
            defaultSize={20}
            minSize={20}
            maxSize={40}
            className="mx-2 flex flex-col items-start gap-1"
          >
            <div className="flex w-full items-center">
              <Button
                className="grow cursor-pointer"
                outline
                onClick={() => setIsOpenCreateNotes(true)}
              >
                <FilePlusIcon size={14} />
              </Button>
            </div>
            <div className="flex w-full flex-col gap-1">
              {getNotesQuery.data?.pages.map((page) => {
                return page.data.map((note) => {
                  return (
                    <Button
                      key={note.id}
                      plain
                      className={cn(
                        "w-full !justify-between ",
                        notesStore.selectedNote?.id === note.id
                          ? "bg-slate-100 hover:!bg-slate-100 dark:bg-slate-800 dark:hover:!bg-slate-800"
                          : "font-medium",
                      )}
                      onClick={() => {
                        notesStore.setSelectedNote({
                          id: note.id,
                          name: note.title,
                        });
                      }}
                    >
                      <span className="truncate text-start text-xs tracking-tight">
                        {note.title}
                      </span>
                      <NotesOptions note={note} />
                    </Button>
                  );
                });
              })}
            </div>
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
