import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { createClient } from "@/utils/supabase/server";

import MeNavbar from "../components/me-navbar";
import { ForceChangeUsernameDialog } from "../components/nav/force-change-username-dialog";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) {
    redirect("/");
  }

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .single();

  if (!userProfile?.name) {
    console.log("uh oh no username");
  }

  return (
    <div className="mx-auto lg:w-[1000px]">
      {!userProfile?.name && <ForceChangeUsernameDialog />}
      <MeNavbar>{children}</MeNavbar>
    </div>
  );
}
