"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/app/components/button";
import { useGetBlogs } from "@/utils/hooks/query/use-get-blogs";
import { BlogOptions } from "@/app/components/feed/blog-options";
import { useUsername } from "@/app/components/subdomain-context";

export default function Blog() {
  const searchParams = useSearchParams();
  const username = useUsername();

  const { data } = useGetBlogs(null, searchParams, username);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between px-4">
        <div>
          <p className="text-2xl font-bold dark:text-slate-100">Blog</p>
        </div>
      </div>

      <div>
        {data &&
          data.pages.map((page) => (
            <div key={page.nextPage}>
              {page.data.map((blog) => (
                <Button
                  plain
                  href={`blog/${blog.id}`}
                  className="flex w-full justify-between"
                  key={blog.id}
                >
                  <p className="text-lg font-medium dark:text-slate-100">
                    {blog.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {new Date(blog.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <BlogOptions blog={blog} />
                  </div>
                </Button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
