"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "./supabase/client";

export function useUser() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState(null as null | User);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        return;
      }
      setCurrentUser(user);
    }
    fetchUser();
  }, []);

  return { currentUser, setCurrentUser };
}
