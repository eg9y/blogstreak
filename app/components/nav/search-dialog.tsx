"use client";

import { Dispatch, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { CommandLoading } from "cmdk";

import { createClient } from "@/utils/supabase/client";
import { useBaseUrl } from "@/utils/hooks/query/use-get-baseurl";
import { getMeilisearchClient } from "@/utils/meilisearch";

import {
  CommandInput,
  CommandList,
  CommandSeparator,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "../ui/command";
import { Link } from "../link";

export const SearchDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) => {
  const meilisearchClient = getMeilisearchClient();
  const baseUrl = useBaseUrl();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState<{
    result: {
      created_at: string;
      id: number;
      raw_text: string;
      topics: string[];
    }[];
    search: string;
  }>({ result: [], search: "" });
  const supabase = createClient();

  useEffect(() => {
    // eslint-disable-next-line @shopify/prefer-early-return
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    (async () => {
      if (!debouncedSearch) {
        return;
      }
      const { results } = await meilisearchClient.multiSearch({
        queries: [
          {
            attributesToCrop: ["raw_text"],
            indexUid: "journals",
            q: debouncedSearch.trim().toLowerCase(),
            attributesToSearchOn: ["raw_text"],
            limit: 5,
            attributesToHighlight: ["raw_text"],
            highlightPreTag: "<mark className='bg-yellow-800'>",
            highlightPostTag: "</mark>",
            // hybrid: {
            //   embedder: "default",
            //   semanticRatio: 0.5,
            // },
          },
        ],
      });

      setIsLoading(false);

      console.log("results", results);

      const data = {
        result: results[0].hits.map((hit) => hit._formatted),
        search: results[0].query,
      };

      setSearchResults(
        (data as any) || {
          result: [],
          search: "",
        },
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, supabase]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput
        placeholder="Search..."
        value={search}
        onValueChange={(event) => {
          setIsLoading(true);
          setSearch(event);
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {isLoading && <CommandLoading>Fetching results...</CommandLoading>}
        <CommandGroup heading="Journal">
          {searchResults.result.map((snippet) => {
            return (
              <CommandItem
                key={snippet.id}
                className="!pointer-events-auto flex !select-auto justify-between"
              >
                <Link
                  href={`${baseUrl}/me/journal/${snippet.id}`}
                  className="flex cursor-pointer items-start gap-2"
                >
                  <div className="flex-shrink text-end">
                    <p className="font-semibold tracking-tight">
                      {new Date(snippet.created_at).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-xs"
                      dangerouslySetInnerHTML={{
                        __html: snippet.raw_text,
                      }}
                    />
                  </div>
                </Link>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Blog"></CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
