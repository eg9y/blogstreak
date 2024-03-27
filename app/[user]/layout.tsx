import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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

  return (
    <>
      <ViewSidebar>{children}</ViewSidebar>
    </>
  );
}
