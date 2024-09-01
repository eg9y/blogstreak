"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useUsername } from "@/app/components/subdomain-context";
import { useGetBlogs } from "@/utils/hooks/query/use-get-blogs";

export default function Blog() {
	const searchParams = useSearchParams();
	const username = useUsername();

	const { data } = useGetBlogs(null, searchParams, username);

	return (
		<div className="flex flex-col gap-4 pt-2">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-2xl font-bold dark:text-slate-100">Blog</p>
				</div>
			</div>

			<div>
				{data &&
					data.pages.map((page) => (
						<div key={page.nextPage} className="flex flex-col gap-8 md:gap-2">
							{page.data.map((blog) => (
								<Link
									href={`blog/${blog.title}`}
									className="flex w-full flex-col md:flex-row md:justify-between"
									key={blog.id}
								>
									<p className="text-lg font-medium  dark:text-slate-100">
										{blog.title}
									</p>
									<div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
										<p className="text-sm text-slate-600 dark:text-slate-300">
											{new Date(blog.created_at).toLocaleDateString("en-US", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									</div>
								</Link>
							))}
						</div>
					))}
			</div>
		</div>
	);
}
