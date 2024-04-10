import { generateHTML } from "@tiptap/html";
import { useMemo } from "react";
import Link from "next/link";
import { LockClosedIcon } from "@radix-ui/react-icons";

import { Database } from "@/schema";
import { extensions } from "@/utils/textEditor";

import { Badge } from "../badge";

import { PostOptions } from "./post-options";

interface PostProps {
  post: Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number] & {
    streaks: number | null;
  };
  isMine: boolean;
  username: string;
}

export function Post({ post, isMine, username }: PostProps) {
  const output = useMemo(() => {
    return generateHTML(JSON.parse(post.post_text!), extensions);
  }, [post.post_text]);

  return (
    <div className="min-h-30 flex w-full flex-col gap-2 rounded-md bg-slate-50 p-2 ring-1 ring-slate-300 drop-shadow-sm dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex h-5 justify-between">
        <div className="flex flex-wrap gap-1">
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
        {isMine && <PostOptions post={post} />}
      </div>
      <Link
        href={`/${isMine ? "me" : username}/post/${post.post_id}`}
        className="prose prose-sm max-w-full grow dark:prose-invert focus:outline-none prose-p:mb-0 prose-p:mt-0 prose-p:leading-normal"
        dangerouslySetInnerHTML={{ __html: output }}
      />
      <div className="flex w-full justify-between">
        <div className="flex w-full items-end justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(post.post_created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="flex gap-1">
            {!post.is_public && (
              <Badge color="zinc">
                <LockClosedIcon />
              </Badge>
            )}
            <Badge color={"red"}>
              <div className="flex items-center gap-1">
                <p>🔥</p>
                <p>{post.streaks}</p>
              </div>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
