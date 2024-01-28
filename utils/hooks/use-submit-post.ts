import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { User } from "@supabase/supabase-js";

export function useSubmitPost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn(content: string) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    const res = await supabase.from("posts").insert({
      text: content,
      user_id: user?.id,
    });

    console.log(res);
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}
