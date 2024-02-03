import { generateHTML } from "@tiptap/html";
import { Badge } from "../badge";
import { useMemo } from "react";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { PostOptions } from "./post-options";
import { Database } from "@/schema";
import Link from "next/link";

export function Post({
  post,
}: {
  post: Database["public"]["Tables"]["posts"]["Row"];
}) {
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

  const output = useMemo(() => {
    return generateHTML(JSON.parse(post.text!), extensions);
  }, [post.text]);

  return (
    <div className="min-h-30 flex w-full flex-col gap-2 rounded-md bg-slate-100 p-2 ring-1 ring-slate-300 drop-shadow-sm dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex gap-1">
        <Link
          href={`/app/post/${post.id}`}
          className="prose prose-sm m-1 grow dark:prose-invert focus:outline-none"
          dangerouslySetInnerHTML={{ __html: output }}
        />
        <PostOptions post={post} />
      </div>
      <div className="flex w-full justify-between">
        <div className="">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="">
          <Badge color="red">Workout</Badge>
        </div>
      </div>
    </div>
  );
}
