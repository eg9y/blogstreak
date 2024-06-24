"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/getUser";

import { Button } from "../button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../dialog";

export function ForceUserSubscription() {
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const supabase = createClient();
  const { loggedInUser } = useUser();

  const redirectToCheckout = async (variantId: string) => {
    setIsLoadingUrl(true);
    const { data, error } = await supabase.functions.invoke(
      "get-checkout-url",
      {
        body: {
          variantId,
          userId: loggedInUser!.id,
          userEmail: loggedInUser!.email,
        },
      },
    );

    if (error) {
      toast.error(`Error: ${error.message}`);
      setIsLoadingUrl(false);
      return;
    }

    window.open(data, "_blank");
    setIsLoadingUrl(false);
  };

  return (
    <Dialog
      open={true}
      onClose={() => {}}
      className={"!h-[90vh] w-[60vw] min-w-[1000px]"}
    >
      <DialogTitle>Subscribe to Blogstreak</DialogTitle>
      <DialogDescription>
        Subscribe to blogstreak to get started with your writing habit!
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-10">
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold">Key Features</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  title: "Streak Tracker",
                  description: "Visualize your consistency and stay motivated",
                  image: "/api/placeholder/300/200",
                },
                {
                  title: "Distraction-Free Editor",
                  description: "Focus solely on your writing",
                  image: "/api/placeholder/300/200",
                },
                {
                  title: "Mobile Support",
                  description: "Write on-the-go and never miss a day",
                  image: "/api/placeholder/300/200",
                },
                {
                  title: "Personal Website",
                  description:
                    "Your own corner of the internet to share your thoughts",
                  image: "/api/placeholder/300/200",
                },
                {
                  title: "Blog & Microblog Publishing",
                  description: "Share both long-form content and quick updates",
                  image: "/api/placeholder/300/200",
                },
                {
                  title: "Content Organization",
                  description:
                    "Tag and categorize your posts for easy navigation",
                  image: "/api/placeholder/300/200",
                },
              ].map((feature, index) => (
                <div key={index} className="rounded bg-gray-800 p-4">
                  {/* <img
                  src={feature.image}
                  alt={feature.title}
                  className="mb-4 rounded"
                /> */}
                  <h4 className="mb-2 font-semibold">{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold">Coming Soon...</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                "Daily Writing Reminders: Gentle nudges to keep you on track",
                "Writing Prompts: Overcome blank page syndrome with tailored inspiration",
                "Progress Analytics: Track your word count, frequency, and growth over time",
                "Milestone Celebrations: Earn badges and rewards for hitting targets",
                "Thought Capsules: Daily prompts to inspire your writing",
                "Audience Insights: Understand your readers with built-in analytics",
                "Customizable Themes: Make your personal site uniquely yours",
              ].map((feature, index) => (
                <div key={index} className="rounded bg-gray-800 p-4">
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogActions className="flex">
        <Button color="blue" href="/me/subscription">
          Manage your Subscription
        </Button>
        <Button
          color="green"
          className={"grow cursor-pointer"}
          // onClick={() => redirectToCheckout("418935")}
          onClick={() => redirectToCheckout("427582")}
          disabled={isLoadingUrl || !loggedInUser}
        >
          {isLoadingUrl ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Subscribe Monthly ($5/month)"
          )}
        </Button>
        <Button
          color="green"
          className={"grow cursor-pointer"}
          // onClick={() => redirectToCheckout("114467")}
          onClick={() => redirectToCheckout("427581")}
          disabled={isLoadingUrl || !loggedInUser}
        >
          {isLoadingUrl ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Subscribe Yearly ($50/year)"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
