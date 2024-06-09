"use client";

import { useCreateJournal } from "@/utils/hooks/mutation/journal/use-create-journal";
import { useUser } from "@/utils/getUser";

import { JournalTextForm } from "./journal-text-form";

export const CreateTextEditor = () => {
  const { loggedInUser } = useUser();
  const submitPostMutation = useCreateJournal(loggedInUser);

  return <JournalTextForm mutation={submitPostMutation} />;
};
