"use client";

import { useEditBlog } from "@/utils/hooks/mutation/blog/use-edit-blog";
import { useUser } from "@/utils/getUser";

import { BlogTextForm } from "./blog-text-form";

export const EditBlogTextEditorComponent = ({ blogId }: { blogId: number }) => {
  const { loggedInUser } = useUser();
  const editBlogMutation = useEditBlog(loggedInUser);
  return <BlogTextForm blogId={blogId} mutation={editBlogMutation} />;
};
