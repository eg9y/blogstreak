"use client";

import { generateHTML } from "@tiptap/react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { extensions } from "@/utils/textEditor";
import { useGetBlogQuery } from "@/utils/hooks/query/use-get-blog";
import { useUser } from "@/utils/getUser";

import { Button } from "../button";

import { IsPublicSwitch } from "./is-public-switch";

export const ViewBlogComponent = ({ blogId }: { blogId: number }) => {
  const { loggedInUser } = useUser();
  const { data: blogData } = useGetBlogQuery(blogId);
  const pathname = usePathname();

  const output = useMemo(() => {
    if (blogData?.data?.text) {
      return generateHTML(JSON.parse(blogData?.data?.text), extensions);
    }
    return "";
  }, [blogData]);

  return (
    <div className="mx-auto flex max-w-[65ch] flex-col gap-2">
      <div className=" relative flex w-full flex-col p-2">
        <p className="text-pretty text-4xl font-bold dark:text-slate-200">
          {blogData?.data?.title}
        </p>
        <div
          className="h-full w-full cursor-text pt-2"
          // Make the div focusable
        >
          <div
            className="prose prose-base grow break-words dark:prose-invert md:prose-lg focus:outline-none prose-p:leading-normal"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>

        {loggedInUser && pathname.split("/")[1] === "me" && (
          <div className="fixed bottom-0 flex w-[1000px] justify-between bg-[hsl(0_0%_100%)] p-4 dark:bg-[hsl(240_10%_3.9%)]">
            <div className="flex items-center gap-1">
              <div className="pointer-events-none">
                <IsPublicSwitch
                  isPublic={blogData?.data?.is_published!!}
                  setIsPublic={() => {}}
                />
              </div>
            </div>
            <Button
              color="orange"
              className="w-40 cursor-pointer self-end"
              href={`/me/blog/${blogId}/edit`}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
