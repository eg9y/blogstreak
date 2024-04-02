"use client";

import { generateHTML } from "@tiptap/react";
import { Badge } from "../badge";
import { useMemo } from "react";
import { useGetPostQuery } from "@/utils/hooks/query/use-get-post";
import { getUser } from "@/utils/getUser";
import { Button } from "../button";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import Scrollbar from "react-scrollbars-custom";
import { IsPublicSwitch } from "./is-public-switch";
import { extensions } from "@/utils/textEditor";

export const ViewTextEditor = ({ postId }: { postId: number }) => {
  const { currentUser } = getUser();
  const { data: postData } = useGetPostQuery(currentUser, postId);
  const { data, isLoading, isFetching, isPending, isSuccess } =
    useGetTopicsQuery(currentUser, postId);

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
          <Button
            color="orange"
            className="w-40 cursor-pointer self-end"
            href={`/me/post/${postId}/edit`}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
