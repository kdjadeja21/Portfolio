"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  className?: string;
  tone?: "default" | "inverted";
};

export default function SectionHeading({
  index,
  eyebrow,
  title,
  className,
  tone = "default",
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
        className={clsx(
          "font-mono text-[0.7rem] uppercase tracking-[0.3em]",
          tone === "inverted" ? "text-ink/70" : "text-accent"
        )}
      >
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
