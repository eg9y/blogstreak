import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useUsername } from "@/app/components/subdomain-context";

// If useUsername is a custom hook that also needs to be defined elsewhere

export function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState("");
  const pathName = usePathname();
  const subdomainUsername = useUsername();

  useEffect(() => {
    let url =
      process.env.NODE_ENV === "production"
        ? "https://blogstreak.com"
        : "http://localhost:3000";

    if (
      process.env.NODE_ENV === "production" &&
      pathName.split("/")[1] !== "me"
    ) {
      url = `https://${subdomainUsername}.blogstreak.com`;
    }

    setBaseUrl(url);
  }, [pathName, subdomainUsername]);

  return baseUrl;
}
