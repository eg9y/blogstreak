import { cookies } from "next/headers";
import AppSidebar from "../components/app-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ForceChangeUsernameDialog } from "../components/nav/force-change-username-dialog";
import ViewSidebar from "../components/view-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const { data, error } = await supabase.auth.getSession();
  if (!data.session || error) {
    redirect("/");
  }

  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", data.session.user.id)
    .single();

  if (!userProfile?.name) {
    console.log("uh oh no username");
  }

  return (
    <div className="mx-auto lg:w-[1000px]">
      {!userProfile?.name && <ForceChangeUsernameDialog />}
      <AppSidebar>
        <ViewSidebar>{children}</ViewSidebar>
      </AppSidebar>
    </div>
  );
}
