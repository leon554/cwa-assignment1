"use client";

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";

function readValue<T>(key: string, initialValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

function writeValue<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

export function useLocalStorageState<T>( key: string,  initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const stored = readValue(key, initialValue);
    setValue(stored);
  }, [key]);

  const setAndPersist: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        writeValue(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, setAndPersist];
}