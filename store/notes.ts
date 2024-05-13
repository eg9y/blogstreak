/* eslint-disable no-unused-vars */
import { create } from "zustand";

import { Database } from "@/schema";

interface BearState {
  posts: Database["public"]["Tables"]["posts"]["Row"][];
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

export const useNotesStore = create<BearState>()((set) => ({
  posts: [],
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
