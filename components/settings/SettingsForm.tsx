"use client";

import { setLayoutCookie, setThemeCookie } from "@/lib/cookies";
import type { LayoutPreference, Theme } from "@/types/settings";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SettingsFormProps = {
  initialTheme: Theme;
  initialLayout: LayoutPreference;
};

export default function SettingsForm({initialTheme, initialLayout}: SettingsFormProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [layout, setLayout] = useState<LayoutPreference>(initialLayout);

  function applyTheme(next: Theme) {
    setTheme(next);
    setThemeCookie(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    router.refresh();
  }

  function applyLayout(next: LayoutPreference) {
    setLayout(next);
    setLayoutCookie(next);
    document.documentElement.setAttribute("data-layout", next);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-lg font-semibold">Theme</legend>
        <div className="flex gap-3">
          {(["light", "dark"] as Theme[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => applyTheme(option)}
              aria-pressed={theme === option}
              className={`rounded-md border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                theme === option
                  ? "border-primary bg-primary text-white"
                  : "border-card-border bg-card hover:bg-background"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-lg font-semibold">Layout</legend>
        <div className="flex gap-3">
          {(["comfortable", "compact"] as LayoutPreference[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => applyLayout(option)}
              aria-pressed={layout === option}
              className={`rounded-md border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                layout === option
                  ? "border-primary bg-primary text-white"
                  : "border-card-border bg-card hover:bg-background"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
