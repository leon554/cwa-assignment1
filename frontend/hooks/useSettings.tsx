"use client";

import { useEffect, useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { getGlobalSettings, updateGlobalSettings, ApiError } from "@/service/api-service";

type Theme = "light" | "dark";
type LayoutPreference = "comfortable" | "compact";

export function useSettings() {
  const [theme, setTheme] = useLocalStorageState<Theme>("settings-theme", "light");
  const [layout, setLayout] = useLocalStorageState<LayoutPreference>("settings-layout","comfortable");

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await getGlobalSettings();
      setTheme(settings.theme ? (settings.theme as Theme) : "light");
      setLayout(settings.layout ? (settings.layout as LayoutPreference) : "comfortable");
    } catch (error) {
      if (error instanceof ApiError) alert(error.message);
    }
  }, [setTheme, setLayout]);

  const setSettings = useCallback(
    async (data: { theme?: Theme; layout?: LayoutPreference }) => {
      const nextTheme = data.theme ?? theme;
      const nextLayout = data.layout ?? layout;

      setTheme(nextTheme);
      setLayout(nextLayout);

      try {
        await updateGlobalSettings({ theme: nextTheme, layout: nextLayout });
      } catch (error) {
        if (error instanceof ApiError) alert(error.message);
      }
    },
    [theme, layout, setTheme, setLayout]
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { theme, layout, setSettings, refreshSettings: fetchSettings };
}