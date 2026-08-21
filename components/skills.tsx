"use client";

import React, { useRef } from "react";
import SectionHeading from "./section-heading";
import { coreSkills, toolboxSkills } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-skill-row]", {
          y: 64,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: "[data-skill-list]",
            start: "top 82%",
          },
        });

        gsap.from("[data-toolbox-item]", {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: "[data-toolbox]",
            start: "top 88%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills and stack"
      className="relative border-t border-line px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading index="05" eyebrow="Stack" title="Tools I think in" />

        <ul data-skill-list className="mt-16">
          {coreSkills.map((skill, index) => (
            <li
              key={skill.name}
              data-skill-row
              className="group border-t border-line last:border-b"
            >
              <div className="flex items-baseline justify-between gap-6 py-5 sm:py-7">
                <span className="flex items-baseline gap-5 sm:gap-8">
                  <span className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-outline font-display text-4xl font-extrabold uppercase tracking-tight transition-all duration-300 group-hover:translate-x-3 group-hover:text-accent sm:text-6xl [-webkit-text-stroke-color:rgb(240_239_233/0.45)] group-hover:[-webkit-text-stroke-color:transparent]">
                    {skill.name}
                  </span>
                </span>
                <span className="hidden shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted transition-colors duration-300 group-hover:text-paper sm:block">
                  {skill.note}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div data-toolbox className="mt-16">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted">
            Also in the toolbox
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {toolboxSkills.map((skill) => (
              <li
                key={skill}
                data-toolbox-item
                className="rounded-full border border-line px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-paper/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
