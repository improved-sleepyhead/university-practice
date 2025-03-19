"use client"; // Делаем хук клиентским

import { useState, useEffect } from "react";

export function useStorage<T>(key: string, initialValue: T, storage: "local" | "session" = "local") {
  const isBrowser = typeof window !== "undefined"; // Проверяем, в браузере ли мы
  const getStorage = () => (isBrowser ? (storage === "local" ? localStorage : sessionStorage) : null);

  const [value, setValue] = useState<T>(() => {
    if (!isBrowser) return initialValue; // SSR-защита

    try {
      const storedValue = getStorage()?.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;

    try {
      getStorage()?.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Ошибка при сохранении в storage");
    }
  }, [key, value]);

  return [value, setValue] as const;
}
