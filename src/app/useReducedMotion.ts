import { useEffect, useState } from "react";

export function useReducedMotion(reducedMotion: boolean): boolean {
  const [systemReducedMotion, setSystemReducedMotion] = useState(
    getSystemReducedMotion,
  );

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setSystemReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);

    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  return reducedMotion || systemReducedMotion;
}

function getSystemReducedMotion(): boolean {
  return (
    typeof window === "undefined" ||
    !window.matchMedia ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
