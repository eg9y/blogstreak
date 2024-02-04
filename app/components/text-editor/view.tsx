"use client";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BadgeButton } from "../badge";
import { useMemo, useRef, useState } from "react";
import { useGetPostQuery } from "@/utils/hooks/query/use-get-post";
import { getUser } from "@/utils/getUser";
import { Button } from "../button";

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
  const [tags, setTags] = useState([] as string[]);
  const editorContainerRef = useRef(null); // Step 1: Create a ref for the parent div

  const { currentUser } = getUser();
  const { data: postData } = useGetPostQuery(currentUser, postId);

  function tagClick(tagName: string) {
    const tagsSet = new Set(tags);
    if (tagsSet.has(tagName)) {
      tagsSet.delete(tagName);
    } else {
      tagsSet.add(tagName);
    }

    setTags(Array.from(tagsSet));
  }

  const output = useMemo(() => {
    if (postData?.data?.text) {
      return generateHTML(JSON.parse(postData?.data?.text), extensions);
    }
    return "";
  }, [postData]);

  return (
    <div className="flex flex-col gap-2">
      <div className=" w-full p-2  dark:bg-slate-800 ">
        <div className="h-[65vh] overflow-y-scroll">
          <div
            className="prose prose-sm m-1 grow dark:prose-invert focus:outline-none"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1">
            <BadgeButton
              className="cursor-pointer"
              color={tags.includes("workout") ? "red" : undefined}
              onClick={() => {
                tagClick("workout");
              }}
            >
              Workout
            </BadgeButton>
            <BadgeButton
              className="cursor-pointer"
              color={tags.includes("full-time_job") ? "orange" : undefined}
              onClick={() => {
                tagClick("full-time_job");
              }}
            >
              Full-time job
            </BadgeButton>
            <BadgeButton
              className="cursor-pointer"
              color={tags.includes("thoughts") ? "blue" : undefined}
              onClick={() => {
                tagClick("thoughts");
              }}
            >
              Thoughts
            </BadgeButton>
          </div>
          <Button
            color="orange"
            className="w-40 cursor-pointer self-end"
            href={`/app/post/${postId}/edit`}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
