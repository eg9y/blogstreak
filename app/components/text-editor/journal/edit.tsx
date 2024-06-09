"use client";

import { useEditPost } from "@/utils/hooks/mutation/journal/use-edit-journal";
import { useUser } from "@/utils/getUser";

import { JournalTextForm } from "./journal-text-form";

export const EditTextEditor = ({ journalId }: { journalId: number }) => {
  const { loggedInUser } = useUser();
  const editPostMutation = useEditPost(loggedInUser);

  return <JournalTextForm journalId={journalId} mutation={editPostMutation} />;
};
