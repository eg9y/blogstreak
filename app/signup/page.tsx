import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from "../components/fieldset";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { LandingNavbar } from "../components/landing-navbar";
import { Text } from "../components/text";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("username") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          name,
        },
      },
    });

    console.log("error", error);

    if (error) {
      return redirect("/signup?message=Could not authenticate user");
    }

    return redirect("/signup?message=Check email to continue sign in process");
  };

  const signUpWithGoogle = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    console.log("error", error);
    console.log("data", data);

    if (error) {
      return redirect("/signup?message=Could not authenticate user via Google");
    }

    return redirect(data.url);
  };

  return (
    <>
      <LandingNavbar />
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="flex flex-col w-full px-8 sm:max-w-md gap-2">
          <div className="">
            <h1 className="text-xl font-bold">Sign Up</h1>
          </div>
          <Text>Sign up with Google or Email</Text>
          {/* Google sign up tailwind button */}
          <form className="" action={signUpWithGoogle}>
            <Fieldset className="flex flex-col gap-2 w-full ">
              <Button color="red" type="submit" className="grow cursor-pointer">
                Sign Up with Google
              </Button>
            </Fieldset>
          </form>

          <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action={signUp}
          >
            <Fieldset>
              <div className="w-full h-[0.10rem] bg-slate-300 rounded-full mt-6" />
              <FieldGroup>
                <Field>
                  <Label>Email</Label>
                  <Input name="email" required />
                </Field>
                <Field>
                  <Label>Username</Label>
                  <Description>Your unique username</Description>
                  <Input name="username" required />
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
                <Field>
                  <Label>Confirm Password</Label>
                  <Input
                    name="confirm_password"
                    required
                    type="password"
                    placeholder="••••••••"
                  />
                </Field>
                <div className="flex flex-col gap-2 w-full ">
                  <Button
                    color="orange"
                    type="submit"
                    className="grow cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </div>
              </FieldGroup>

              {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                  {searchParams.message}
                </p>
              )}
            </Fieldset>
          </form>
        </div>
      </main>
    </>
  );
}
