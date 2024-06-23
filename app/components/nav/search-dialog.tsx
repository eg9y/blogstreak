"use client";

import { Dispatch, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { CommandLoading } from "cmdk";

import { createClient } from "@/utils/supabase/client";
import { useBaseUrl } from "@/utils/hooks/query/use-get-baseurl";

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
import { useUsername } from "../subdomain-context";

export const SearchDialog = ({
  isOpen,
  setIsOpen,
  isPublic,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  isPublic: boolean;
}) => {
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
  const [userId, setUserId] = useState<string | null>(null);
  const username = useUsername();

  useEffect(() => {
    (async () => {
      if (isPublic && username) {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("name", username)
          .single();
        if (error && data === null) {
          console.error("error", error);
        }
        setUserId(data!.user_id);
      }
    })();
  }, [isPublic, username]);

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
        setIsLoading(false);
        return;
      }
      let results: any = null;

      if (isPublic) {
        results = await (
          await supabase.functions.invoke("meilisearch-public", {
            body: {
              query: debouncedSearch.trim(),
              userId,
            },
          })
        ).data;
      } else {
        results = await (
          await supabase.functions.invoke("meilisearch", {
            body: {
              op: "search",
              data: {
                query: debouncedSearch.trim(),
              },
            },
          })
        ).data;
      }

      setIsLoading(false);

      const data = {
        result: results[0].hits.map((hit: any) => hit._formatted),
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
  }, [debouncedSearch, supabase, isPublic, userId]);

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSearch("");
          setSearchResults({
            result: [],
            search: "",
          });
        }
        setIsOpen(open);
      }}
    >
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
