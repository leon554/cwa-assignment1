"use client";

import type { LayoutPreference, Theme } from "@/types/settings";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import Spinner from "../shared/Spinner";

export default function SettingsForm() {
  const router = useRouter();
  const {theme, layout, setSettings} = useSettings()
  const [pending, setPending] = useState<null | "theme" | "layout">(null)

  async function applyTheme(next: Theme) {
    setPending("theme")
    await setSettings({theme: next})
    document.documentElement.classList.toggle("dark", next === "dark");
    router.refresh();
    setPending(null)
  }

  async function applyLayout(next: LayoutPreference) {
    setPending("layout")
    await setSettings({layout: next})
    document.documentElement.setAttribute("data-layout", next);
    router.refresh();
    setPending(null)
  }

  return (
    <div className="space-y-8">
      <fieldset disabled={pending !== null} className="disabled:opacity-60">
        <legend className="mb-3 text-lg font-semibold">Theme</legend>
        <div className="flex gap-3">
          {(["light", "dark"] as Theme[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => applyTheme(option)}
              aria-pressed={theme === option}
              className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium capitalize transition-colors disabled:cursor-not-allowed ${
                theme === option
                  ? "border-primary bg-primary text-white"
                  : "border-card-border bg-card hover:bg-background"
              }`}
            >
              {pending === "theme" && theme === option && <Spinner size={14} />}
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={pending !== null} className="disabled:opacity-60">
        <legend className="mb-3 text-lg font-semibold">Layout</legend>
        <div className="flex gap-3">
          {(["comfortable", "compact"] as LayoutPreference[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => applyLayout(option)}
              aria-pressed={layout === option}
              className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium capitalize transition-colors disabled:cursor-not-allowed ${
                layout === option
                  ? "border-primary bg-primary text-white"
                  : "border-card-border bg-card hover:bg-background"
              }`}
            >
              {pending === "layout" && layout === option && <Spinner size={14} />}
              {option}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
