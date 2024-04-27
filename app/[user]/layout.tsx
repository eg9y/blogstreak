import { ReactNode } from "react";
import { headers } from "next/headers";

import { getSubdomain } from "@/utils/getSubdomain";

import ViewerNavbar from "../components/viewer-navbar";
import SubdomainContextProvider from "../components/subdomain-context";

export default function Layout({ children }: { children: ReactNode }) {
  const headersList = headers();
  const host = headersList.get("host");
  const subdomain = getSubdomain(host);

  return (
    <div className="w-full lg:mx-auto lg:w-[1000px]">
      <SubdomainContextProvider subdomain={subdomain}>
        <div className=" py-4">
          <ViewerNavbar>{children}</ViewerNavbar>
        </div>
      </SubdomainContextProvider>
    </div>
  );
}
