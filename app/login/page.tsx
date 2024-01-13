import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Field, FieldGroup, Fieldset, Label } from "../components/fieldset";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { LandingNavbar } from "../components/landing-navbar";

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
        <div className="flex flex-col w-full px-8 sm:max-w-md gap-2">
          <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action={signIn}
          >
            <Fieldset>
              <div className="">
                <h1 className="text-xl font-bold">Sign In</h1>
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
                <div className="flex flex-col gap-2 w-full ">
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
