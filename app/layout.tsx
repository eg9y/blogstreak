import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiniMicroblog",
  description: "Personal microblogging platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-800",
        )}
      >
        {children}
      </body>
    </html>
  );
}
