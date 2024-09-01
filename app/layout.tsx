import type { Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import "./globals.css";

import { ReactQueryProvider } from "@/app/components/react-query-provider";
import { cn } from "@/utils/utils";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ViewTransitions>
			<html lang="en" className="" dir="ltr">
				<head />
				<body
					className={cn(
						inter.className,
						"bg-[hsl(0_0%_100%)] dark:bg-[hsl(240_10%_3.9%)]",
					)}
				>
					<ReactQueryProvider>
						<ThemeProvider>{children}</ThemeProvider>
						<Toaster />
					</ReactQueryProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
