"use client";

import { useEditPost } from "@/utils/hooks/mutation/journal/use-edit-journal";

import { JournalTextForm } from "./journal-text-form";

export const EditTextEditor = ({ journalId }: { journalId: number }) => {
  const editPostMutation = useEditPost();

  return <JournalTextForm journalId={journalId} mutation={editPostMutation} />;
};
