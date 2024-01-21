import { Editor } from "@tiptap/react";
import { create } from "zustand";

export interface TextEditorState {}

export const useTextEditorState = create<TextEditorState>()((set) => ({}));
