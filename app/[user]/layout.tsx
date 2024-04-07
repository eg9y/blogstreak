import ViewSidebar from "../components/view-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto lg:w-[1000px]">
      <ViewSidebar>{children}</ViewSidebar>
    </div>
  );
}
