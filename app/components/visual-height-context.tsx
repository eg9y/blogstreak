"use client";

import { ReactNode, createContext, useContext } from "react";

import { useVisualViewport } from "@/utils/hooks/query/use-visual-viewport";

const SubdomainContext = createContext<string | null>(null);

export const useUsername = () => useContext(SubdomainContext);

export default function VisualHeightContext({
  children,
}: {
  children: ReactNode;
}) {
  const { visualViewport } = useVisualViewport();
  return (
    <div
      style={{
        height: visualViewport.height,
      }}
    >
      {children}
    </div>
  );
}
