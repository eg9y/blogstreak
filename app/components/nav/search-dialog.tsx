"use client";

import { Dispatch, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
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

export const SearchDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) => {
  const baseUrl = useBaseUrl();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 1000);
  const [searchResults, setSearchResults] = useState<
    {
      content: string;
      journal_id: string;
      posts: {
        created_at: string;
      };
    }[]
  >([]);
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
      const { data, error } = await supabase.functions.invoke("search", {
        body: {
          search: debouncedSearch,
        },
      });
      setIsLoading(false);

      if (error) {
        toast.error("Error searching :(");
        return;
      }

      setSearchResults(data.result || []);
    })();
  }, [debouncedSearch, supabase]);

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

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
          {searchResults.map((result) => {
            return (
              <CommandItem
                key={result.content}
                className="!pointer-events-auto flex !select-auto justify-between"
                value={result.content}
              >
                <Link
                  href={`${baseUrl}/me/journal/${result.journal_id}`}
                  className="flex cursor-pointer items-start gap-2"
                >
                  <div className="w-52 text-end">
                    <p className="font-semibold tracking-tight">
                      {new Date(result.posts.created_at).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div className="grow">
                    <p className="text-xs">{result.content}</p>
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
