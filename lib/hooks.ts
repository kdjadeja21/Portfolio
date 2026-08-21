import { useCallback, useEffect, useRef } from "react";
import { useActiveSectionContext } from "@/context/active-section-context";
import type { SectionName } from "./types";

export function useSectionInView(sectionName: SectionName, threshold = 0.4) {
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();
  const timeOfLastClickRef = useRef(timeOfLastClick);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    timeOfLastClickRef.current = timeOfLastClick;
  }, [timeOfLastClick]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (
              entry.isIntersecting &&
              Date.now() - timeOfLastClickRef.current > 1000
            ) {
              setActiveSection(sectionName);
            }
          }
        },
        { threshold }
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [sectionName, threshold, setActiveSection]
  );

  return { ref };
}
