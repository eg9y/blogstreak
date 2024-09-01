import { headers } from "next/headers";
import { ReactNode } from "react";

import { getSubdomain } from "@/utils/getSubdomain";

import SubdomainContextProvider from "../components/subdomain-context";
import ViewerNavbar from "../components/viewer-navbar";

export default function Layout({ children }: { children: ReactNode }) {
	const headersList = headers();
	const host = headersList.get("host");
	const subdomain = getSubdomain(host);

	return (
		<div className="h-full lg:mx-auto lg:w-[1000px]">
			<SubdomainContextProvider subdomain={subdomain}>
				<ViewerNavbar>{children}</ViewerNavbar>
			</SubdomainContextProvider>
		</div>
	);
}
