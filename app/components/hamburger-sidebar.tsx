"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/app/components/ui/sheet";
import { cn } from "@/utils/utils";
import { useBaseUrl } from "@/utils/hooks/query/use-get-baseurl";

import { Button } from "./button";

export default function HamburgerSidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const baseUrl = useBaseUrl();
  const isMe = pathName.split("/")[1] === "me";

  const [sheetOpen, setSheetOpen] = useState(false);

  // Function to close the Sheet
  const closeSheet = () => setSheetOpen(false);

  // Adjust navigation to close Sheet when navigating
  const navigateAndCloseSheet = (url: string) => {
    router.push(url);
    closeSheet();
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          plain
          onClick={() => setSheetOpen(true)}
          className="block sm:hidden"
        >
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="text-left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <SheetDescription className="flex flex-col gap-4 pt-6">
          <button
            onClick={() =>
              navigateAndCloseSheet(isMe ? `${baseUrl}/me` : `${baseUrl}`)
            }
            className={cn(
              pathName === "/" || pathName === "/me"
                ? "font-bold text-slate-900 dark:text-slate-300"
                : "font-normal text-slate-700 dark:text-slate-100",
              "text-left text-lg sm:text-lg",
            )}
          >
            Home
          </button>
          <button
            onClick={() =>
              navigateAndCloseSheet(
                isMe ? `${baseUrl}/me/blog` : `${baseUrl}/blog`,
              )
            }
            className={cn(
              pathName.split("/")[pathName.split("/").length - 1] === "blog"
                ? "font-bold text-slate-900 dark:text-slate-300"
                : "font-normal text-slate-700 dark:text-slate-100",
              "text-left text-lg sm:text-lg",
            )}
          >
            Blog
          </button>
          <button
            onClick={() =>
              navigateAndCloseSheet(
                isMe ? `${baseUrl}/me/journal` : `${baseUrl}/journal`,
              )
            }
            className={cn(
              pathName.split("/")[pathName.split("/").length - 1] ===
                "journal" && !searchParams.get("private")
                ? "font-bold text-slate-900 dark:text-slate-300"
                : "font-normal text-slate-700 dark:text-slate-100",
              "text-left text-lg sm:text-lg",
            )}
          >
            Journal
          </button>
          {isMe && (
            <button
              onClick={() =>
                navigateAndCloseSheet(`${baseUrl}/me/journal?private=true`)
              }
              className={cn(
                pathName.split("/")[pathName.split("/").length - 1] ===
                  "journal" && searchParams.get("private")
                  ? "font-bold text-slate-900 dark:text-slate-300"
                  : "font-normal text-slate-700 dark:text-slate-100",
                "text-left text-lg sm:text-lg",
              )}
            >
              Private Journal
            </button>
          )}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
