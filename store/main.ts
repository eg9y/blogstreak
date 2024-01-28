import { Database } from "@/schema";
import { create } from "zustand";

interface BearState {
  posts: Database["public"]["Tables"]["posts"]["Row"][];
}

const useBearStore = create<BearState>()((set) => ({
  posts: [],
}));
