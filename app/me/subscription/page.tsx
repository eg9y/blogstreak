import { cookies } from "next/headers";

import { Badge } from "@/app/components/badge";
import { createClient } from "@/utils/supabase/server";
import { ManageSubscription } from "@/app/components/subscription/manage-subscription";

export default async function Subscription() {
  const cookie = cookies();
  const supabase = createClient(cookie);
  const { data } = await supabase.auth.getUser();

  const { data: userSubscriptions } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", data.user!.id)
    .single();

  const notSubscribedYet =
    !userSubscriptions ||
    !userSubscriptions.status ||
    !["active", "on_trial", "paid", "cancelled"].includes(
      userSubscriptions.status,
    );

  const subscriptionCancelled = userSubscriptions?.status === "cancelled";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Subscription</h1>

      <div className="flex items-center gap-2">
        <p className="text-sm">Subscription Status: </p>
        {notSubscribedYet && <Badge color="red">Inactive</Badge>}
        {subscriptionCancelled && <Badge color="yellow">Cancelled</Badge>}
        {!notSubscribedYet && !subscriptionCancelled && (
          <Badge color="green">Active</Badge>
        )}
      </div>
      {userSubscriptions?.ends_at && (
        <div className="">
          <p>
            Subscription ends at:{" "}
            {new Date(userSubscriptions.ends_at).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      <ManageSubscription
        notSubscribedYet={notSubscribedYet}
        subscriptionCancelled={subscriptionCancelled}
        subscriptionId={
          userSubscriptions ? userSubscriptions.subscription_id : null
        }
        user={data.user || null}
      />
    </div>
  );
}
