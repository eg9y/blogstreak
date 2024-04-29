"use client";

import { useSearchParams } from "next/navigation";

import { cn } from "@/utils/utils";
import { useUser } from "@/utils/getUser";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";

import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";

export function Options() {
  const searchQuery = useSearchParams();
  const { loggedInUser } = useUser();

  const { data } = useGetTopicsQuery(loggedInUser);

  return (
    <ul role="list" className="flex w-full flex-wrap  gap-1 ">
      <li>
        <Button
          href={`/me`}
          className={cn(
            "group flex items-center gap-x-1 rounded-md !pb-1 !pt-1 text-sm font-semibold leading-6",
          )}
          plain
        >
          <Checkbox
            aria-label="Allow embedding"
            name="allow_embedding"
            className={"pointer-events-none"}
            checked={searchQuery.get("tags") === null}
            color="white"
          />
          <span className="truncate">All Posts</span>
        </Button>
      </li>
      {data?.map((tag) => (
        <li key={tag.name}>
          <Button
            href={`?tags=${tag.name}`}
            className={cn(
              "group flex items-center gap-x-1 rounded-md !pb-1 !pt-1 text-sm font-semibold leading-6",
            )}
            plain
          >
            <Checkbox
              aria-label="Allow embedding"
              name="allow_embedding"
              className={"pointer-events-none"}
              checked={searchQuery.get("tags") === tag.name}
              color={tag.color as any}
            />
            <span className="truncate">{tag.name}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
