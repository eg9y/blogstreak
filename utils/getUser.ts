"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "./supabase/client";

export function useUser() {
  const supabase = createClient();
  const [loggedInUser, setLoggedInUser] = useState(null as null | User);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        return;
      }
      setLoggedInUser(user);
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loggedInUser, setLoggedInUser };
}
