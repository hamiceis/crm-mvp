"use client";

"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

type ThemePreference = "light" | "dark" | "system";

export function ThemePreferenceSync({ preference }: { preference: ThemePreference }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (preference === "system") return;
    setTheme(preference);
  }, [preference, setTheme]);

  return null;
}
