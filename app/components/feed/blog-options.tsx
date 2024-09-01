"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "next-view-transitions";
import { useState } from "react";

import { BLOGS_QUERY_KEY } from "@/constants/query-keys";
import { Database } from "@/schema";
import { useUser } from "@/utils/getUser";
import { useDeleteBlog } from "@/utils/hooks/mutation/blog/use-delete-blog";

import { Button } from "../button";
import {
	Dialog,
	DialogActions,
	DialogDescription,
	DialogTitle,
} from "../dialog";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownMenu,
} from "../dropdown";

export function BlogOptions({
	blog,
}: {
	blog: Database["public"]["Functions"]["get_blogs"]["Returns"][number];
}) {
	const [isOpenDelete, setIsOpenDelete] = useState(false);
	const { loggedInUser } = useUser();
	const deleteBlogMutation = useDeleteBlog(loggedInUser);
	const queryClient = useQueryClient();

	return (
		<>
			<Dropdown>
				<DropdownButton
					className="h-5 w-10 cursor-pointer md:size-10"
					plain
					aria-label="Account options"
				>
					<DotsHorizontalIcon />
				</DropdownButton>
				<DropdownMenu>
					<DropdownItem>
						<Link href={`/me/blog/${blog.title}/edit`}>Edit</Link>
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem
						onClick={() => {
							setIsOpenDelete(true);
						}}
						color="red"
					>
						Delete
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<Dialog open={isOpenDelete} onClose={setIsOpenDelete} className="z-[52]">
				<DialogTitle>Delete post?</DialogTitle>
				<DialogDescription>
					This can’t be undone and it will be removed from your profile, the
					timeline of any accounts that follow you, and from search results.
				</DialogDescription>
				<DialogActions>
					<Button plain onClick={() => setIsOpenDelete(false)}>
						Cancel
					</Button>
					<Button
						color="red"
						onClick={() => {
							deleteBlogMutation.mutate(blog.title, {
								onSuccess() {
									setIsOpenDelete(false);
									return queryClient.invalidateQueries({
										queryKey: [BLOGS_QUERY_KEY, loggedInUser?.id],
									});
								},
							});
						}}
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
