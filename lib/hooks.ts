import { useCallback, useEffect, useRef } from "react";
import { useActiveSectionContext } from "@/context/active-section-context";
import type { SectionName } from "./types";

// Activates a section when it crosses a thin horizontal band centered in the
// viewport, rather than reacting to how much of the section's total height is
// visible. A ratio-based threshold breaks down once sections have very
// different heights (e.g. the multi-card Products section is much taller
// than the viewport), since a tall section's visible *ratio* can stay small
// even while it fills the whole screen, letting a neighboring section keep
// winning the race. A fixed band is independent of section height, so
// exactly one section owns it at any scroll position.
const ACTIVATION_BAND: IntersectionObserverInit = {
  rootMargin: "-45% 0px -45% 0px",
  threshold: 0,
};

export function useSectionInView(sectionName: SectionName) {
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

      const observer = new IntersectionObserver(([entry]) => {
        if (
          entry.isIntersecting &&
          Date.now() - timeOfLastClickRef.current > 1000
        ) {
          setActiveSection(sectionName);
        }
      }, ACTIVATION_BAND);
      observer.observe(node);
      observerRef.current = observer;
    },
    [sectionName, setActiveSection]
  );

  return { ref };
}
