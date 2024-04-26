"use client";

import { generateHTML } from "@tiptap/react";
import { useMemo } from "react";
import Scrollbar from "react-scrollbars-custom";
import { usePathname } from "next/navigation";

import { useGetPostQuery } from "@/utils/hooks/query/use-get-post";
import { useUser } from "@/utils/getUser";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { extensions } from "@/utils/textEditor";

import { Badge } from "../badge";
import { Button } from "../button";

import { IsPublicSwitch } from "./is-public-switch";

export const ViewTextEditor = ({ journalId }: { journalId: number }) => {
  const { loggedInUser } = useUser();
  const { data: postData } = useGetPostQuery(loggedInUser, journalId);
  const { data, isLoading, isSuccess } = useGetTopicsQuery(
    loggedInUser,
    journalId,
  );
  const pathname = usePathname();

  const output = useMemo(() => {
    if (postData?.data?.text) {
      return generateHTML(JSON.parse(postData?.data?.text), extensions);
    }
    return "";
  }, [postData]);

  return (
    <div className="flex flex-col gap-2">
      <div className=" w-full p-2  dark:bg-slate-800 ">
        <div
          className="h-full cursor-text"
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
          <div className="flex items-center gap-1">
            {isLoading && "Loading topics"}
            {isSuccess && data?.length === 0 && (
              <p className="text-sm text-slate-600">No Tags</p>
            )}
            {isSuccess &&
              data?.map((topic) => {
                return (
                  <Badge
                    className=""
                    key={topic.name}
                    color={topic.isSelected ? (topic.color as any) : undefined}
                  >
                    {topic.name}
                  </Badge>
                );
              })}
            <div className="pointer-events-none">
              <IsPublicSwitch
                isPublic={postData?.data?.is_public!!}
                setIsPublic={() => {}}
              />
            </div>
          </div>
          {pathname.split("/")[1] === "me" && (
            <Button
              color="orange"
              className="w-40 cursor-pointer self-end"
              href={`/me/journal/${journalId}/edit`}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
