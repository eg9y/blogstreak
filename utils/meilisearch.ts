import { MeiliSearch } from "meilisearch";

export const getMeilisearchClient = () => {
  const client = new MeiliSearch({
    host: "https://search.blogstreak.com",
    apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_ADMIN_KEY || "",
  });

  return client;
};
