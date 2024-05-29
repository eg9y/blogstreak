"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/app/components/button";
import { useUser } from "@/utils/getUser";
import { useGetBlogs } from "@/utils/hooks/query/use-get-blogs";
import { BlogOptions } from "@/app/components/feed/blog-options";
import { Badge } from "@/app/components/badge";

export default function Blog() {
  const { loggedInUser } = useUser();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const username = pathName.split("/")[1];

  const { data } = useGetBlogs(loggedInUser, searchParams, username);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold dark:text-slate-100">Blog</p>
        </div>
        <Button href="blog/write" color="dark">
          Write Blog
        </Button>
      </div>

      <div>
        {data &&
          data.pages.map((page) => (
            <div key={page.nextPage} className="flex flex-col gap-8 md:gap-2">
              {page.data.map((blog) => (
                <Link
                  href={`blog/${blog.id}`}
                  className="flex w-full flex-col md:flex-row md:justify-between"
                  key={blog.id}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium  dark:text-slate-100">
                      {blog.title}
                    </p>
                    {blog.is_public && <Badge color="blue">Published</Badge>}
                    {!blog.is_public && <Badge color="zinc">Draft</Badge>}
                  </div>
                  <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
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
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
