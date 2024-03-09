import { Database } from "@/schema";
import { create } from "zustand";

interface BearState {
  posts: Database["public"]["Tables"]["posts"]["Row"][];
  page: number;
}

export const useBearStore = create<BearState>()((set) => ({
  posts: [],
  page: 1,
}));
