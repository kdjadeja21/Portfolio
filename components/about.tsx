"use client";

import React, { useRef } from "react";
import Image from "next/image";
import SectionHeading from "./section-heading";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { useSectionInView } from "@/lib/hooks";

type StatItem = {
  value: string;
  label: string;
};

const stats: readonly StatItem[] = [
  { value: "7+", label: "Years shipping production software" },
  { value: "5", label: "Public products live" },
  { value: "1000+", label: "Cursor India community members" },
  { value: "3", label: "Roles — engineer, ambassador, consultant" },
] as const;

export default function About() {
  const { ref } = useSectionInView("About", 0.3);
  const sectionRef = useRef<HTMLElement>(null);

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node;
    ref(node);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-about-lede]", {
          type: "words",
        });
        gsap.from(split.words, {
          opacity: 0.12,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-about-lede]",
            start: "top 78%",
            end: "bottom 55%",
            scrub: true,
          },
        });

        gsap.from("[data-about-para]", {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-about-paras]",
            start: "top 80%",
          },
        });

        gsap.from("[data-about-portrait]", {
          y: 64,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-about-portrait]",
            start: "top 85%",
          },
        });

        gsap.to("[data-about-portrait-inner]", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-about-portrait]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.from("[data-about-stat]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-about-stats]",
            start: "top 88%",
          },
        });

        return () => split.revert();
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={setRefs}
      id="about"
      aria-label="About me"
      className="relative border-t border-line px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading index="01" eyebrow="About" title="Engineer, ambassador, builder" />

        <div className="mt-16 grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div data-about-portrait className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent/15 via-surface to-surface">
              <div data-about-portrait-inner className="p-8 sm:p-12">
                <Image
                  src="/Mimoji-removebg-preview.png"
                  alt="Krushnasinh Jadeja portrait"
                  width={480}
                  height={480}
                  quality={95}
                  className="mx-auto w-56 sm:w-72"
                />
              </div>
              <div className="flex items-center justify-between border-t border-line px-6 py-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                <span>Krushnasinh Jadeja</span>
                <span className="text-accent">Gujarat, IN</span>
              </div>
            </div>
          </div>

          <div data-about-paras>
            <p
              data-about-lede
              className="text-2xl font-medium leading-snug text-paper sm:text-3xl"
            >
              I&apos;m a senior software engineer and AI consultant with 7+
              years shipping production systems — currently at EPAM Systems,
              and serving as an official Cursor Ambassador for the India
              community.
            </p>

            <p data-about-para className="mt-8 leading-relaxed text-paper/70">
              I completed an{" "}
              <span className="text-paper">
                MCA in Computer Engineering at Marwadi University
              </span>
              . Day to day I work in TypeScript and React, with a strong bias
              toward AI-assisted engineering.
            </p>

            <p data-about-para className="mt-5 leading-relaxed text-paper/70">
              I help organisations adopt{" "}
              <a
                className="link-underline text-accent"
                href="https://cursor.com"
                target="_blank"
                rel="noreferrer"
              >
                Cursor
              </a>{" "}
              and build automation around delivery — from event ops tools like{" "}
              <span className="text-paper">EventClaim</span> to the small
              public products I ship when a problem is worth solving.
            </p>

            <p data-about-para className="mt-5 leading-relaxed text-paper/70">
              I use{" "}
              <a
                className="link-underline text-accent"
                href="https://x.ai/bot"
                target="_blank"
                rel="noreferrer"
              >
                Grok&apos;s bot
              </a>{" "}
              heavily to automate repetitive work, reminders, and similar
              tasks. <span className="italic">When I&apos;m not coding</span>,
              I enjoy playing video games and watching movies.
            </p>
          </div>
        </div>

        <dl
          data-about-stats
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-about-stat
              className="group flex flex-col bg-ink p-6 transition-colors duration-500 hover:bg-surface sm:p-8"
            >
              <dt className="order-2 mt-3 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-4xl font-extrabold tracking-tight text-paper transition-colors duration-500 group-hover:text-accent sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
