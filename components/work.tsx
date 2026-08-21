"use client";

import React, { useRef, useState } from "react";
import clsx from "clsx";
import { HiPlus } from "react-icons/hi";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-work-row]", {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-work-list]",
            start: "top 85%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected client work"
      className="relative border-t border-line px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="04"
            eyebrow="Client work"
            title="Selected engagements"
          />
          <p className="max-w-xs pb-2 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.2em] text-muted">
            Production systems built for clients — under NDA, so no names or
            screenshots.
          </p>
        </div>

        <div data-work-list className="mt-16">
          {projectsData.map((project, index) => {
            const isOpen = openIndex === index;
            const panelId = `work-panel-${index}`;
            return (
              <div
                key={project.title}
                data-work-row
                className="group border-t border-line last:border-b"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center gap-5 py-7 text-left sm:gap-8 sm:py-9"
                >
                  <span
                    className={clsx(
                      "font-mono text-xs transition-colors duration-300",
                      isOpen ? "text-accent" : "text-muted"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={clsx(
                      "flex-1 font-display text-xl font-bold uppercase tracking-tight transition-all duration-300 sm:text-3xl",
                      isOpen
                        ? "translate-x-2 text-accent"
                        : "text-paper group-hover:translate-x-2 group-hover:text-accent"
                    )}
                  >
                    {project.title}
                  </span>
                  <HiPlus
                    aria-hidden
                    className={clsx(
                      "shrink-0 text-xl text-muted transition-transform duration-300",
                      isOpen && "rotate-45 text-accent"
                    )}
                  />
                </button>

                <div
                  id={panelId}
                  className={clsx(
                    "grid transition-[grid-template-rows] duration-500 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-9 sm:grid-cols-[1fr_auto] sm:gap-12 sm:pl-14">
                      <p className="max-w-2xl leading-relaxed text-paper/70">
                        {project.description}
                      </p>
                      <ul className="flex max-w-xs flex-wrap content-start gap-2">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
