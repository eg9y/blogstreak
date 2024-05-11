import { create } from "zustand";

import { Database } from "@/schema";

interface BearState {
  posts: Database["public"]["Tables"]["posts"]["Row"][];
  page: number;
}

export const useBearStore = create<BearState>()((set) => ({
  posts: [],
  page: 1,
}));
