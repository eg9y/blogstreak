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

interface PostProps {
  post: Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number];
}

export function Post({ post }: PostProps) {
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
    return generateHTML(JSON.parse(post.post_text!), extensions);
  }, [post.post_text]);

  return (
    <div className="min-h-30 flex w-full flex-col gap-2 rounded-md bg-slate-50 p-2 ring-1 ring-slate-300 drop-shadow-sm dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex justify-between gap-1">
        <Link
          href={`/app/post/${post.post_id}`}
          className="prose prose-sm grow dark:prose-invert focus:outline-none prose-p:mb-0 prose-p:mt-0 prose-p:leading-normal"
          dangerouslySetInnerHTML={{ __html: output }}
        />
        <PostOptions post={post} />
      </div>
      <div className="flex w-full justify-between">
        <div className="">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(post.post_created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="">
          {post.post_topics &&
            (
              post.post_topics as { color: string; id: number; name: string }[]
            ).map((post_topic) => {
              return (
                <Badge color={post_topic.color as any} key={post_topic.name}>
                  {post_topic.name}
                </Badge>
              );
            })}
        </div>
      </div>
    </div>
  );
}
