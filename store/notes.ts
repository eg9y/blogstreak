/* eslint-disable no-unused-vars */
import { create } from "zustand";

import { Database } from "@/schema";

interface BearState {
  posts: Database["public"]["Tables"]["posts"]["Row"][];
  selectedFolderId: number | null;
  setSelectedFolderId: (folderId: number) => number;
}

export const useNotesStore = create<BearState>()((set) => ({
  posts: [],
  selectedFolderId: null,
  setSelectedFolderId: (folderId) => {
    set({
      selectedFolderId: folderId,
    });
    return folderId;
  },
}));
