import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { createClient } from "@/utils/supabase/server";
import { getSubdomain } from "@/utils/getSubdomain";

import { ForceChangeUsernameDialog } from "../../components/nav/force-change-username-dialog";
import SubdomainContextProvider from "../../components/subdomain-context";
import { ForceUserSubscription } from "../../components/nav/force-user-subscription";
import { Button } from "@/app/components/button";
import { Heading } from "@/app/components/heading";
import { Link } from "next-view-transitions";

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

  const { data: userSubscriptions } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", data.user.id)
    .single();

  const notSubscribedYet =
    !userSubscriptions ||
    !userSubscriptions.status ||
    !["active", "on_trial", "paid", "cancelled"].includes(
      userSubscriptions.status,
    );

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
      <div className="mx-auto flex h-dvh flex-col md:w-[1000px]">
        {!userProfile?.name && <ForceChangeUsernameDialog />}
        {userProfile?.name && notSubscribedYet && <ForceUserSubscription />}
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="inline-flex gap-4">
            <Link href="/me/blog">
              <Button plain>Back</Button>
            </Link>
            <Heading>Blog</Heading>
          </div>
          {children}
        </div>
      </div>
    </SubdomainContextProvider>
  );
}
