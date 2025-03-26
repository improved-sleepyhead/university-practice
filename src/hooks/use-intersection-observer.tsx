import { useCallback, useRef } from "react";

export function useIntersectionObserver(onIntersect: () => void) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastTriggeredTime = useRef(0);
  
    return useCallback((el: HTMLDivElement | null) => {
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
            rootMargin: "400px",
            threshold: 0.1,
          }
        );
        observerRef.current.observe(el);
      }
    }, [onIntersect]);
  }
  