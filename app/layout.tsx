import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";

import { cn } from "@/utils/cn";

import { ReactQueryProvider } from "./components/react-query-provider";
import ThemeProvider from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlogStreak",
  description: "Personal journalging platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="">
      <body className={cn(inter.className, "")}>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
