import ViewSidebar from "../components/view-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ViewSidebar>{children}</ViewSidebar>
    </>
  );
}
