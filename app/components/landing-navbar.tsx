import { signUpWithGoogle } from "@/utils/signUpWithGoogle";

import { LandingNavbarContainer } from "./landing-navbar-container";
import { Button } from "./button";
import { Fieldset } from "./fieldset";

export const LandingNavbar = () => {
  return (
    <LandingNavbarContainer>
      <div className="flex-shrink-0">
        <form className="" action={signUpWithGoogle}>
          <Fieldset className="flex w-full flex-col gap-2 ">
            <Button color="red" type="submit" className="grow cursor-pointer">
              Sign In with Google
            </Button>
          </Fieldset>
        </form>
      </div>
    </LandingNavbarContainer>
  );
};
