/* eslint-disable no-unused-vars */
"use client";

import { toast } from "sonner";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import { Button } from "../button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../dialog";
import { Loader2Icon } from "lucide-react";

type setUsernameInputs = {
  username: string;
};

export function ForceUserSubscription() {
  const router = useRouter();
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const supabase = createClient();

  const redirectToCheckout = async (variantId: string) => {
    setIsLoadingUrl(true);
    const { data, error } = await supabase.functions.invoke(
      "get-checkout-url-test-mode",
      {
        body: { variantId },
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
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>Subscribe to Blogstreak</DialogTitle>
      <DialogDescription>
        Subscribe to blogstreak to get started with your writing habit!
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-10">
          <div className="">
            <h2>Features</h2>
            <li>write blogposts</li>
            <li>customize your bio</li>
            <li>write journals</li>
            <li>you and your readers can search your writings with ease</li>
            <li>toggle privacy of your writings</li>
            <li>full markdown support</li>
            <li>mobile support</li>
            <li>streaks for your journaling habits</li>
          </div>

          <div className="">
            <h2>Future features</h2>
            <li>Newsletters functionality for your readers</li>
          </div>
        </div>
      </DialogBody>
      <DialogActions className="flex">
        <Button
          color="green"
          className={"grow cursor-pointer"}
          onClick={() => redirectToCheckout("418935")}
          disabled={isLoadingUrl}
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
          onClick={() => redirectToCheckout("114467")}
          disabled={isLoadingUrl}
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
