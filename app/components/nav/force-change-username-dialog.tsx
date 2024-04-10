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
import { Field, Fieldset, Label } from "../fieldset";
import { Input } from "../input";

type setUsernameInputs = {
  username: string;
};

export function ForceChangeUsernameDialog() {
  const [usernameExists, setUsernameExists] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<setUsernameInputs>({
    defaultValues: {
      username: "",
    },
  });

  const onSubmit: SubmitHandler<setUsernameInputs> = async (data) => {
    const { username } = data;
    const { data: userExists, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("name", username)
      .single();

    if (userExists) {
      setUsernameExists(true);
    }

    const { data: loggedInUser, error: loggedInUserError } =
      await supabase.auth.getUser();

    // Perform the update operation with Supabase

    if (loggedInUser.user) {
      await supabase
        .from("profiles")
        .update({ name: username })
        .eq("user_id", loggedInUser.user.id);

      router.refresh();
      toast.success("Your username have been set up!", {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Set your Username</DialogTitle>
        <DialogDescription>Please set your username</DialogDescription>
        <DialogBody>
          <Fieldset>
            <Field>
              <Label>Username</Label>
              <Controller
                control={control}
                name="username"
                rules={{
                  required: "Username is required",
                  pattern: {
                    value:
                      /^(?=.{4,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/,
                    message:
                      "Username must be 4-20 characters long, may contain letters, numbers, and '_ . -', and must not start or end with a special character or contain consecutive special characters.",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input onChange={onChange} value={value} />
                )}
              />
              {(errors.username || usernameExists) && (
                <div className="pt-2">
                  <p className="text-xs text-red-500 dark:text-red-300 ">
                    {errors.username && errors.username.message}
                    {usernameExists &&
                      "Username already exists. Please choose another one."}
                  </p>
                </div>
              )}
            </Field>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button type="submit">Set Username</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
