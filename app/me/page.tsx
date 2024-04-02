"use client";
import { getUser } from "@/utils/getUser";
import { useGetBioQuery } from "@/utils/hooks/query/use-get-bio";
import { useGetUsernameQuery } from "@/utils/hooks/query/use-get-username";
import { extensions } from "@/utils/textEditor";
import { generateHTML } from "@tiptap/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Scrollbar from "react-scrollbars-custom";
import { Button } from "../components/button";

export default function Home() {
  const pathName = usePathname();
  const possibleUsername = pathName.split("/")[1];
  const { currentUser } = getUser();
  const { data: user } = useGetUsernameQuery(currentUser);

  const {
    data: bioData,
    isLoading,
    isSuccess,
  } = useGetBioQuery(
    user ? (possibleUsername === "me" ? user : possibleUsername) : undefined,
  );

  const output = useMemo(() => {
    if (bioData?.data?.bio) {
      return generateHTML(JSON.parse(bioData.data.bio), extensions);
    }
    return "";
  }, [bioData]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <Scrollbar style={{ width: "100%", height: "80vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex justify-evenly">
            <p className="text-3xl font-bold underline dark:text-slate-300">
              Me
            </p>
          </div>

          <div
            className="prose prose-sm max-w-full grow dark:prose-invert focus:outline-none  prose-p:mb-0 prose-p:mt-0 prose-p:leading-normal"
            dangerouslySetInnerHTML={{ __html: output }}
          />
          {isSuccess && !bioData?.data?.bio && (
            <div>
              <p className="dark:text-slate-100">No Bio</p>
              <Button href="me/bio/write" className="!p-1 !text-sm">
                Add Bio
              </Button>
            </div>
          )}
          {isSuccess && bioData?.data?.bio && (
            <div>
              <Button href="me/bio/write" className="!p-1 !text-sm">
                Edit Bio
              </Button>
            </div>
          )}
        </main>
      </Scrollbar>
    </div>
  );
}
