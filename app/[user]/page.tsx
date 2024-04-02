"use client";
import Scrollbar from "react-scrollbars-custom";
import { usePathname } from "next/navigation";
import { useGetBioQuery } from "@/utils/hooks/query/use-get-bio";
import { getUser } from "@/utils/getUser";
import { useMemo } from "react";
import { extensions } from "@/utils/textEditor";
import { generateHTML } from "@tiptap/react";
import { useGetUsernameQuery } from "@/utils/hooks/query/use-get-username";

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
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Scrollbar style={{ width: "100%", height: "80vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="self-center text-xl font-bold dark:text-slate-300">
                Egan
              </h1>
            </div>
            {isSuccess && !bioData?.data?.bio && (
              <div>
                <p>No Bio</p>
              </div>
            )}
            <div
              className="prose prose-sm max-w-full grow dark:prose-invert focus:outline-none  prose-p:mb-0 prose-p:mt-0 prose-p:leading-normal"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </main>
      </Scrollbar>
    </div>
  );
}
