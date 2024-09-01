import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { ViewBlogComponent } from "@/app/components/text-editor/blog/view";
import { BLOGS_QUERY_KEY } from "@/constants/query-keys";
import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: { blogTitle: number; user: string };
};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const cookie = cookies();
	const supabase = createClient(cookie);

	// fetch data
	const blog = await supabase
		.from("blogs")
		.select("*")
		.eq("title", params.blogTitle!)
		.single()
		.throwOnError();

	return {
		title: blog.data?.title,
	};
}

export default async function BlogDetail({ params }: Props) {
	const cookie = cookies();
	const supabase = createClient(cookie);

	const queryFn = () => {
		return supabase
			.from("blogs")
			.select("*")
			.eq("title", params.blogTitle!)
			.single()
			.throwOnError();
	};

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: [BLOGS_QUERY_KEY, params.user, params.blogTitle],
		queryFn,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="w-full">
				<main className="mx-auto flex w-full  flex-col gap-4 px-2 pb-16 pt-12">
					<ViewBlogComponent blogTitle={params.blogTitle} />
				</main>
			</div>
		</HydrationBoundary>
	);
}
