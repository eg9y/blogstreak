"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";
import { User } from "@supabase/supabase-js";

export function getUser() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState(null as null | User);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log("error", error);
        return;
      }
      setCurrentUser(user);
    }
    fetchUser();
  }, []);

  return { currentUser, setCurrentUser };
}
