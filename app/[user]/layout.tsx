import { ReactNode } from "react";
import { headers } from "next/headers";

import { getSubdomain } from "@/utils/getSubdomain";

import ViewSidebar from "../components/view-sidebar";
import SubdomainContextProvider from "../components/subdomain-context";

export default function Layout({ children }: { children: ReactNode }) {
  const headersList = headers();
  const host = headersList.get("host");
  const subdomain = getSubdomain(host);

  return (
    <div className="mx-auto lg:w-[1000px]">
      <SubdomainContextProvider subdomain={subdomain}>
        <ViewSidebar>{children}</ViewSidebar>
      </SubdomainContextProvider>
    </div>
  );
}
