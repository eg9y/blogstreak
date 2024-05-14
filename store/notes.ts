/* eslint-disable no-unused-vars */
import { create } from "zustand";

import { Database } from "@/schema";

interface NotesState {
  notes: Database["public"]["Tables"]["notes"]["Row"][];
  // openedFolders: {
  //   [key: string]: {
  //     folder: Database["public"]["Tables"]["notes_folders"]["Row"];
  //     notes: Database["public"]["Tables"]["notes"]["Row"][];
  //   };
  // };
  openedFolderIds: number[];
  setOpenedFolderIds: (folderIds: number[]) => number[];
  selectedFolder: {
    id: number;
    name: string;
  } | null;
  selectedNote: {
    id: number;
    name: string;
  } | null;
  setSelectedFolder: (folder: { id: number; name: string }) => {
    id: number;
    name: string;
  };
  setSelectedNote: (note: { id: number; name: string }) => {
    id: number;
    name: string;
  };
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  // openedFolders: {},
  openedFolderIds: [],
  setOpenedFolderIds: (folderIds) => {
    set({
      openedFolderIds: folderIds,
    });

    return folderIds;
  },
  selectedFolder: null,
  selectedNote: null,
  setSelectedFolder: (selectedFolder: { id: number; name: string }) => {
    set({
      selectedFolder,
    });
    return selectedFolder;
  },
  setSelectedNote: (selectedNote: { id: number; name: string }) => {
    set({
      selectedNote,
    });
    return selectedNote;
  },
}));
