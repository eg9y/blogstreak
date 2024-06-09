"use client";

import { useCreateBlog } from "@/utils/hooks/mutation/blog/use-create-blog";
import { useUser } from "@/utils/getUser";

import { BlogTextForm } from "./blog-text-form";

export const CreateBlogTextEditorComponent = () => {
  const { loggedInUser } = useUser();
  const createBlogMutation = useCreateBlog(loggedInUser);
  return <BlogTextForm mutation={createBlogMutation} />;
};
