import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";

import { cn } from "@/utils/utils";

import { ReactQueryProvider } from "./components/react-query-provider";
import ThemeProvider from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "BlogStreak";
const APP_DEFAULT_TITLE = "BlogStreak";
const APP_TITLE_TEMPLATE = "%s - Blogstreak";
const APP_DESCRIPTION = "";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="" dir="ltr">
      <head />
      <body className={cn(inter.className, "")}>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
