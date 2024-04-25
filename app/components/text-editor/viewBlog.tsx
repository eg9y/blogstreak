"use client";

import { generateHTML } from "@tiptap/react";
import { useMemo } from "react";
import Scrollbar from "react-scrollbars-custom";
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
    <div className="flex flex-col gap-2">
      <div className=" w-full p-2  dark:bg-slate-800 ">
        <p className="text-4xl font-bold dark:text-slate-200">
          {blogData?.data?.title}
        </p>
        <div
          className="h-full cursor-text pt-2"
          // Make the div focusable
        >
          <Scrollbar
            style={{
              height: "65vh",
            }}
          >
            <div
              className="prose prose-sm max-w-full grow dark:prose-invert focus:outline-none  prose-p:mb-0 prose-p:mt-0 prose-p:leading-normal"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </Scrollbar>
        </div>

        <div className="flex justify-between">
          {loggedInUser && (
            <div className="flex items-center gap-1">
              <div className="pointer-events-none">
                <IsPublicSwitch
                  isPublic={blogData?.data?.is_published!!}
                  setIsPublic={() => {}}
                />
              </div>
            </div>
          )}
          {pathname.split("/")[1] === "me" && (
            <Button
              color="orange"
              className="w-40 cursor-pointer self-end"
              href={`/me/blog/${blogId}/edit`}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
