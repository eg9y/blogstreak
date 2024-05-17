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
  const [debouncedSearch] = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState<{
    result: {
      id: number;
      similarity: number;
      content: string;
      journal_id: string;
      created_at: string;
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
      const { data, error } = await supabase.functions.invoke("search", {
        body: {
          search: debouncedSearch.trim().toLowerCase(),
        },
      });
      setIsLoading(false);

      if (error) {
        toast.error("Error searching :(");
        return;
      }

      console.log("data", data);

      setSearchResults(
        data || {
          result: [],
          search: "",
        },
      );
    })();
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
                  href={`${baseUrl}/me/journal/${snippet.journal_id}`}
                  className="flex cursor-pointer items-start gap-2"
                >
                  <div className="w-52 text-end">
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
                  <div className="grow">
                    <p className="text-xs">{snippet.content}</p>
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
