import { NextResponse } from "next/server";
// import { MeiliSearch } from "meilisearch";

export function GET() {
  // request: Request
  // const client = new MeiliSearch({
  //   host: "search.blogstreak.com",
  //   apiKey: "NEXT_MEILISEARCH_ADMIN_KEY",
  // });

  // client.se;

  return NextResponse.json({
    results: [""],
  });
}
