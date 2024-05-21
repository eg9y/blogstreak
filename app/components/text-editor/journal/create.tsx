"use client";

import { useCreatePost } from "@/utils/hooks/mutation/journal/use-create-journal";

import { JournalTextForm } from "./journal-text-form";

export const CreateTextEditor = () => {
  const submitPostMutation = useCreatePost();

  return <JournalTextForm mutation={submitPostMutation} />;
};
