"use client";

import { useUser } from "@/utils/getUser";
import { useEditBlog } from "@/utils/hooks/mutation/blog/use-edit-blog";

import { BlogTextForm } from "./blog-text-form";

export const EditBlogTextEditorComponent = ({
	blogTitle,
}: { blogTitle: number }) => {
	const { loggedInUser } = useUser();
	const editBlogMutation = useEditBlog(loggedInUser);
	return <BlogTextForm blogTitle={blogTitle} mutation={editBlogMutation} />;
};
