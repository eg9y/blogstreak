import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";

import { cn } from "@/utils/cn";

import { ReactQueryProvider } from "./components/react-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlogStreak",
  description: "Personal journalging platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-zinc-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-800"
    >
      <body className={cn(inter.className, "")}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
