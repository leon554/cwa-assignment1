import {
  DEFAULT_LAYOUT,
  DEFAULT_THEME,
  LAYOUT_COOKIE,
  THEME_COOKIE,
  type LayoutPreference,
  type Theme,
} from "@/types/settings";

export function getThemeFromCookie(cookieValue: string | undefined): Theme {
  return cookieValue === "dark" ? "dark" : DEFAULT_THEME;
}

export function getLayoutFromCookie(
  cookieValue: string | undefined,
): LayoutPreference {
  return cookieValue === "compact" ? "compact" : DEFAULT_LAYOUT;
}

export function setClientCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function setThemeCookie(theme: Theme): void {
  setClientCookie(THEME_COOKIE, theme);
}

export function setLayoutCookie(layout: LayoutPreference): void {
  setClientCookie(LAYOUT_COOKIE, layout);
}
