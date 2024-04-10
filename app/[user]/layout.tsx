import { ReactNode } from "react";

import ViewSidebar from "../components/view-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto lg:w-[1000px]">
      <ViewSidebar>{children}</ViewSidebar>
    </div>
  );
}
