"use client";

import { cn } from "@/utils/cn";
import { getUser } from "@/utils/getUser";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { getHexColor } from "@/utils/presetColors";
import { useSearchParams } from "next/navigation";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";

export function Options() {
  const searchQuery = useSearchParams();
  const { currentUser } = getUser();

  const { data, isLoading, isFetching, isPending, isSuccess } =
    useGetTopicsQuery(currentUser);

  return (
    <ul role="list" className="flex gap-1">
      <li>
        <Button
          href={`/me`}
          className={cn(
            "group flex items-center gap-x-1 rounded-md p-2 text-sm font-semibold leading-6",
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
              "group flex items-center gap-x-1 rounded-md p-2 text-sm font-semibold leading-6",
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
