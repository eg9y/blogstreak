"use client";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Badge } from "../badge";
import { useMemo, useRef, useState } from "react";
import { useGetPostQuery } from "@/utils/hooks/query/use-get-post";
import { getUser } from "@/utils/getUser";
import { Button } from "../button";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import Scrollbar from "react-scrollbars-custom";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      HTMLAttributes: {
        class: "",
      },
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      HTMLAttributes: {
        class: "",
      },
    },
  }),
];

export const ViewTextEditor = ({ postId }: { postId: number }) => {
  const editorContainerRef = useRef(null); // Step 1: Create a ref for the parent div

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
              className="prose prose-sm grow dark:prose-invert focus:outline-none  prose-p:mb-0 prose-p:mt-0 prose-p:leading-normal"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </Scrollbar>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-1">
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
