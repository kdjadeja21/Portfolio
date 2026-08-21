"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.4,
        },
      });
    });
  });

  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left scale-x-0 bg-accent"
    />
  );
}
