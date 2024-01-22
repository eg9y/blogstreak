import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import { Field, FieldGroup, Fieldset, Label } from "../components/fieldset";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { LandingNavbar } from "../components/landing-navbar";
import { signUpWithGoogle } from "@/utils/signUpWithGoogle";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("data", data);

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  return (
    <>
      <LandingNavbar />
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="flex w-full flex-col gap-2 px-8 sm:max-w-md">
          <div className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-4">
            <form action={signIn}>
              <Fieldset>
                <div className="">
                  <h1 className="text-xl font-bold dark:text-slate-50">
                    Sign In
                  </h1>
                </div>
                <FieldGroup>
                  <Field>
                    <Label>Email</Label>
                    <Input name="email" required />
                  </Field>

                  <Field>
                    <Label>Password</Label>
                    <Input
                      name="password"
                      required
                      type="password"
                      placeholder="••••••••"
                    />
                  </Field>
                  <div className="flex w-full flex-col gap-2 ">
                    <Button
                      color="orange"
                      type="submit"
                      className="grow cursor-pointer"
                    >
                      Sign In
                    </Button>
                  </div>
                </FieldGroup>

                {searchParams?.message && (
                  <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center dark:text-slate-50">
                    {searchParams.message}
                  </p>
                )}
              </Fieldset>
            </form>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-slate-500 dark:bg-slate-800">
                  Or
                </span>
              </div>
            </div>
            <form className="" action={signUpWithGoogle}>
              <Fieldset className="flex w-full flex-col gap-2 ">
                <Button
                  color="red"
                  type="submit"
                  className="grow cursor-pointer"
                >
                  Sign In with Google
                </Button>
              </Fieldset>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
