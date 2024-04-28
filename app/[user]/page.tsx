"use client";

import Scrollbar from "react-scrollbars-custom";
import { useMemo } from "react";
import { generateHTML } from "@tiptap/react";

import { useGetBioQuery } from "@/utils/hooks/query/use-get-bio";
import { extensions } from "@/utils/textEditor";

import { useUsername } from "../components/subdomain-context";

export default function Home() {
  const actualUsername = useUsername();

  const { data: bioData, isSuccess } = useGetBioQuery(actualUsername);

  const output = useMemo(() => {
    if (bioData?.data?.bio) {
      return generateHTML(JSON.parse(bioData.data.bio), extensions);
    }
    return "";
  }, [bioData]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Scrollbar style={{ width: "100%", height: "80vh" }}>
        <main className="mx-auto flex flex-col gap-4 p-4 sm:min-w-[400px]">
          <div className="flex flex-col gap-4">
            {isSuccess && !bioData?.data?.bio && (
              <div>
                <p>No Bio</p>
              </div>
            )}
            <div
              className="prose prose-sm max-w-full grow dark:prose-invert focus:outline-none   prose-p:leading-normal"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </main>
      </Scrollbar>
    </div>
  );
}
