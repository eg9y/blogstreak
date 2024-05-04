import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { createClient } from "@/utils/supabase/server";
import { getSubdomain } from "@/utils/getSubdomain";

import MeNavbar from "../components/me-navbar";
import { ForceChangeUsernameDialog } from "../components/nav/force-change-username-dialog";
import SubdomainContextProvider from "../components/subdomain-context";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookie = cookies();
  const supabase = createClient(cookie);
  const headersList = headers();
  const host = headersList.get("host");
  const subdomain = getSubdomain(host);

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
    <SubdomainContextProvider subdomain={subdomain}>
      <div className="mx-auto min-h-screen md:w-[1000px]">
        {!userProfile?.name && <ForceChangeUsernameDialog />}
        <MeNavbar>{children}</MeNavbar>
      </div>
    </SubdomainContextProvider>
  );
}
