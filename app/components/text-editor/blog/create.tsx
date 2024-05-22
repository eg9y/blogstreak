"use client";

import { useCreateBlog } from "@/utils/hooks/mutation/blog/use-create-blog";

import { BlogTextForm } from "./blog-text-form";

export const CreateBlogTextEditorComponent = () => {
  const createBlogMutation = useCreateBlog();
  return <BlogTextForm mutation={createBlogMutation} />;
};
