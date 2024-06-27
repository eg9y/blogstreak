"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

import { Button } from "../button";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "../dialog";

export const ManageSubscription = ({
  notSubscribedYet,
  subscriptionCancelled,
  subscriptionId,
  user,
}: {
  notSubscribedYet: boolean;
  subscriptionCancelled: boolean;
  subscriptionId: string | null;
  user: User | null;
}) => {
  const router = useRouter();
  const [isLoadingCancelSubs, setIsLoadingCancelSubs] = useState(false);
  const [isLoadingResumeSubs, setIsloadingResumeSubs] = useState(false);
  const [isOpenCancelSubsModal, setIsOpenCancelSubsModal] = useState(false);
  const [isOpenResumeSubsModal, setIsOpenResumeSubsModal] = useState(false);
  const supabase = createClient();

  const cancelSubscription = async () => {
    setIsLoadingCancelSubs(true);
    const { data, error } = await supabase.functions.invoke(
      "cancel-subscription",
      {
        body: {
          subscriptionId,
        },
      },
    );

    if (error && !data) {
      console.log("error", error);
      toast.success("Error cancelling subscription");
      setIsLoadingCancelSubs(false);
      return;
    }

    toast.success("Successfully cancelled subscription!", {
      onAutoClose() {
        router.refresh();
        setIsLoadingCancelSubs(false);
        setIsOpenCancelSubsModal(false);
      },
      onDismiss() {
        router.refresh();
        setIsLoadingCancelSubs(false);
        setIsOpenCancelSubsModal(false);
      },
    });
  };

  const resumeSubscription = async () => {
    setIsLoadingCancelSubs(true);
    const { data, error } = await supabase.functions.invoke(
      "resume-subscription",
      {
        body: {
          subscriptionId,
        },
      },
    );

    if (error && !data) {
      console.log("error", error);
      toast.success("Error resuming subscription");
      setIsloadingResumeSubs(false);
      return;
    }

    toast.success("Successfully resumed subscription!", {
      onAutoClose() {
        router.refresh();
        setIsloadingResumeSubs(false);
        setIsOpenResumeSubsModal(false);
      },
      onDismiss() {
        router.refresh();
        setIsloadingResumeSubs(false);
        setIsOpenResumeSubsModal(false);
      },
    });
  };

  const redirectToCheckout = async (variantId: string) => {
    const { data: checkoutUrl, error } = await supabase.functions.invoke(
      "get-checkout-url-test-mode",
      {
        body: {
          variantId,
          userId: user?.id,
          userEmail: user?.email,
        },
      },
    );

    if (error) {
      return;
    }

    window.open(checkoutUrl, "_blank");
  };

  return (
    <div>
      {notSubscribedYet && (
        <Button
          color="green"
          onClick={() => {
            redirectToCheckout("427582");
          }}
        >
          Subscribe to Blogstreak
        </Button>
      )}
      {subscriptionCancelled && (
        <Button
          color="green"
          onClick={() => {
            setIsOpenResumeSubsModal(true);
          }}
        >
          Resume your subscription
        </Button>
      )}

      {!notSubscribedYet && !subscriptionId && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      {subscriptionId && !notSubscribedYet && !subscriptionCancelled && (
        <div>
          <Button
            color="red"
            onClick={() => {
              setIsOpenCancelSubsModal(true);
            }}
          >
            Cancel Subscription
          </Button>
          <p className="text-sm text-red-500">
            P.S. You&apos;ll enter a grace period before your subscription
            expires at the next scheduled renewal date
          </p>
        </div>
      )}
      <Dialog
        open={isOpenResumeSubsModal || isLoadingResumeSubs}
        onClose={setIsOpenResumeSubsModal}
      >
        <DialogTitle>Resume Subscription</DialogTitle>
        <DialogDescription>
          Are you sure you want to resume your subscription
        </DialogDescription>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsOpenResumeSubsModal(false)}
            disabled={isLoadingResumeSubs}
          >
            Close
          </Button>
          <Button
            color="red"
            onClick={resumeSubscription}
            disabled={isLoadingResumeSubs}
          >
            Resume Subscription
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isOpenCancelSubsModal || isLoadingCancelSubs}
        onClose={setIsOpenCancelSubsModal}
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel your subscription
        </DialogDescription>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsOpenCancelSubsModal(false)}
            disabled={isLoadingCancelSubs}
          >
            Close
          </Button>
          <Button
            color="red"
            onClick={cancelSubscription}
            disabled={isLoadingCancelSubs}
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
