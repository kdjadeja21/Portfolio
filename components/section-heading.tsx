"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  className?: string;
};

export default function SectionHeading({
  index,
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current!.querySelectorAll("[data-heading-el]"), {
          y: 56,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      <p
        data-heading-el
        className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-accent"
      >
        <span data-connector className="connector-node" aria-hidden />
        {index} / {eyebrow}
      </p>
      <h2
        data-heading-el
        className="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl"
      >
        {title}
      </h2>
    </div>
  );
}
