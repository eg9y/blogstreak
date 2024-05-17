import { createBrowserClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

import { Database } from "@/schema";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")!;
  console.log("authHeader", authHeader);
  console.log("request headers", request.headers.entries());

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      cookies: {},
    },
  );

  const { searchParams } = new URL(request.url);

  const { data, error } = await supabase.functions.invoke("search", {
    body: {
      search: searchParams.get("search")!,
    },
  });

  console.log("search results:", data);
  console.log("Error:", error);

  if (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    results: [data],
  });
}
