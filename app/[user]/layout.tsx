import AppSidebar from "../components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <AppSidebar>{children}</AppSidebar>
    </>
  );
}
