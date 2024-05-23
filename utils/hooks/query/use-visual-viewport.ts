import { useEffect, useState } from "react";

const getViewports = () => ({
  viewport: {
    width: Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
    ),
    height: Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
    ),
  },
  visualViewport: {
    width: window.visualViewport?.width,
    height: window.visualViewport?.height,
  },
});

export const useVisualViewport = () => {
  const [state, setState] = useState(getViewports);
  useEffect(() => {
    const handleResize = () => setState(getViewports);
    window.visualViewport?.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);
  return state;
};
