"use client";

import React, { useRef } from "react";
import Image from "next/image";
import SectionHeading from "./section-heading";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Experience() {
  const { ref } = useSectionInView("Experience", 0.15);
  const sectionRef = useRef<HTMLElement>(null);

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node;
    ref(node);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-timeline-progress]", {
          scaleY: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-timeline]",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        });

        const entries = gsap.utils.toArray<HTMLElement>("[data-timeline-entry]");
        for (const entry of entries) {
          gsap.from(entry, {
            x: 48,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 85%",
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={setRefs}
      id="experience"
      aria-label="Career journey"
      className="relative border-t border-line px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading index="06" eyebrow="Journey" title="Where I've been" />

        <div data-timeline className="relative mt-20 max-w-3xl">
          <div
            className="absolute bottom-0 left-6 top-0 w-px bg-line"
            aria-hidden
          />
          <div
            data-timeline-progress
            className="absolute bottom-0 left-6 top-0 w-px origin-top bg-accent"
            aria-hidden
          />

          <ol className="flex flex-col gap-14">
            {experiencesData.map((experience) => (
              <li
                key={`${experience.title}-${experience.date}`}
                data-timeline-entry
                className="relative pl-20"
              >
                <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper">
                  <Image
                    src={experience.logoSrc}
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden
                    className={
                      "logoClassName" in experience
                        ? experience.logoClassName
                        : "h-6 w-6 object-contain"
                    }
                  />
                </span>

                <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-accent">
                  {experience.date}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {experience.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {experience.location}
                </p>
                {experience.description ? (
                  <p className="mt-3 max-w-xl leading-relaxed text-paper/70">
                    {experience.description}
                  </p>
                ) : null}
                {"clients" in experience ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                      Clients
                    </span>
                    {experience.clients.map((client) => (
                      <span
                        key={client}
                        className="rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-accent"
                      >
                        {client}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
