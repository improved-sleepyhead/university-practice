import { useCallback, useRef } from "react";

export function useIntersectionObserver(
  onIntersect: () => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastTriggeredTime = useRef(0);

  return useCallback(
    (el: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (el) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const now = Date.now();
              if (entry.isIntersecting && now - lastTriggeredTime.current > 500) {
                lastTriggeredTime.current = now;
                onIntersect();
              }
            });
          },
          {
            rootMargin: "100px", // Увеличьте rootMargin, чтобы активировать раньше
            threshold: 0.1, // Порог пересечения
            ...options,
          }
        );
        observerRef.current.observe(el);
      }
    },
    [onIntersect, options]
  );
}