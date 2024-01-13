import { Button } from "@/app/components/button";
import Link from "next/link";
import AppNavbar from "../components/app-navbar";

export default function Home() {
  return (
    <>
      <AppNavbar />
      <main className="flex min-h-screen flex-col mx-auto gap-4 w-1/2 min-w-[400px] p-24">
        <Link href="/signup">
          <Button color="orange">Create my blog</Button>
        </Link>
      </main>
    </>
  );
}
