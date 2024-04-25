"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";

import { useUser } from "@/utils/getUser";
import { useGetUsernameQuery } from "@/utils/hooks/query/use-get-username";

const SubdomainContext = createContext<string | null>(null);

export const useUsername = () => useContext(SubdomainContext);

export default function SubdomainContextProvider({
  children,
  subdomain,
}: {
  children: ReactNode;
  subdomain: string | null;
}) {
  const pathName = usePathname();
  const pathnameUsername = useMemo(() => pathName.split("/")[1], [pathName]);
  const { currentUser } = useUser();
  const { data: user } = useGetUsernameQuery(currentUser);

  const actualUsername = useMemo(() => {
    // If subdomain is provided, use it directly
    if (subdomain) {
      return subdomain;
    }

    // If "me" is in the pathname and a user is logged in, return the user's username
    if (pathnameUsername === "me" && user) {
      return user;
    }

    // Fallback to the username from the pathname
    return pathnameUsername;
  }, [subdomain, pathnameUsername, user]);

  return (
    <SubdomainContext.Provider value={actualUsername}>
      {children}
    </SubdomainContext.Provider>
  );
}
