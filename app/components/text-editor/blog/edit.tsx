"use client";

import { useEditBlog } from "@/utils/hooks/mutation/blog/use-edit-blog";

import { BlogTextForm } from "./blog-text-form";

export const EditBlogTextEditorComponent = ({ blogId }: { blogId: number }) => {
  const editBlogMutation = useEditBlog();
  return <BlogTextForm blogId={blogId} mutation={editBlogMutation} />;
};
