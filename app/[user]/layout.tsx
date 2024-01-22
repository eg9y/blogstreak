import { cookies } from "next/headers";
import AppSidebar from "../components/app-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const { data, error } = await supabase.auth.getSession();
  if (!data.session || error) {
    redirect("/login");
  }

  return (
    <>
      <AppSidebar>{children}</AppSidebar>
    </>
  );
}
