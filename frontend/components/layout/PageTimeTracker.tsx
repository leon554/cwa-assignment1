"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function sendPageView(route: string, startedAt: number) {
  const durationSeconds = Math.max(0, Math.round((performance.now() - startedAt) / 1000));
  const body = new Blob([JSON.stringify({ route, durationSeconds })], { type: "text/plain" });
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80";
  navigator.sendBeacon(`${base}/api/metrics/page-view`, body);
}

export default function PageTimeTracker() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const startedAtRef = useRef<number | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    const previousPath = pathnameRef.current;
    const previousStart = startedAtRef.current;
    if (previousStart !== null && !sentRef.current && previousPath !== pathname) {
      sendPageView(previousPath, previousStart);
    }
    pathnameRef.current = pathname;
    startedAtRef.current = performance.now();
    sentRef.current = false;
  }, [pathname]);

  useEffect(() => {
    function flush() {
      if (sentRef.current || startedAtRef.current === null) return;
      sentRef.current = true;
      sendPageView(pathnameRef.current, startedAtRef.current);
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        flush();
        return;
      }
      startedAtRef.current = performance.now();
      sentRef.current = false;
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  return null;
}
