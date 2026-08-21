"use client";

import { useRef } from "react";
import Link from "next/link";
import { BsLinkedin } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter, FaArrowDownLong } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { useSectionInView } from "@/lib/hooks";
import { useMergedRefs } from "@/lib/merge-refs";
import { useActiveSectionContext } from "@/context/active-section-context";
import { socialLinks, showCvDownload, cvDownloadPath } from "@/lib/site";
import { heroRoles, heroMarqueeItems } from "@/lib/data";
import HeroCanvas from "@/components/hero-canvas";
import Marquee from "@/components/marquee";
import Magnetic from "@/components/magnetic";
import CursorMark from "@/components/cursor-mark";

const linkedInUrl = socialLinks.find((link) => link.name === "LinkedIn")!.url;
const githubUrl = socialLinks.find((link) => link.name === "GitHub")!.url;
const xUrl = socialLinks.find((link) => link.name === "X")!.url;
const cursorUrl = socialLinks.find((link) => link.name === "Cursor")!.url;

const iconLinks = [
  { href: linkedInUrl, label: "LinkedIn", icon: <BsLinkedin /> },
  { href: xUrl, label: "X", icon: <FaXTwitter /> },
  { href: githubUrl, label: "GitHub", icon: <FaGithub /> },
  { href: cursorUrl, label: "Official Cursor profile", icon: <CursorMark /> },
] as const;

export default function Hero() {
  const { ref } = useSectionInView("Home");
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const sectionRef = useRef<HTMLElement>(null);
  const setRefs = useMergedRefs(sectionRef, ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const nameSplit = SplitText.create("[data-hero-name]", {
          type: "chars",
          mask: "chars",
          charsClass: "will-change-transform",
        });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(nameSplit.chars, {
          yPercent: 120,
          duration: 1.1,
          stagger: 0.028,
          delay: 0.15,
        })
          .from(
            "[data-hero-eyebrow]",
            { y: 24, opacity: 0, duration: 0.8 },
            "-=0.7"
          )
          .from(
            "[data-hero-copy] > *",
            { y: 32, opacity: 0, duration: 0.9, stagger: 0.09 },
            "-=0.55"
          )
          .from(
            "[data-hero-bottom]",
            { opacity: 0, duration: 0.9 },
            "-=0.4"
          );

        gsap.to("[data-hero-name-wrap]", {
          yPercent: 18,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => nameSplit.revert();
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={setRefs}
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <HeroCanvas />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-10 pt-32 sm:px-8">
        <p
          data-hero-eyebrow
          className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:text-xs"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-paper">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Open to AI consulting
          </span>
          <span>Gujarat, India — UTC+5:30</span>
        </p>

        <h1 data-hero-name-wrap className="select-none">
          <span
            data-hero-name
            className="block font-display text-[clamp(2.9rem,12.5vw,10.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight"
          >
            Krushnasinh
          </span>
          <span
            data-hero-name
            className="block font-display text-[clamp(2.9rem,12.5vw,10.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight"
          >
            Jadeja<span className="text-accent">.</span>
          </span>
        </h1>

        <div
          data-hero-copy
          className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-accent">
              {heroRoles.join(" · ")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-paper/80 sm:text-lg">
              I build production software, consult on AI-assisted engineering,
              and help organisations automate the work around shipping —
              7+ years from idea to deploy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="#contact"
                onClick={() => {
                  setActiveSection("Contact");
                  setTimeOfLastClick(Date.now());
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink transition-transform hover:scale-[1.03] active:scale-95"
              >
                Let&apos;s talk
                <HiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>

            {showCvDownload ? (
              <Magnetic>
                <a
                  href={cvDownloadPath}
                  download
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-paper transition-colors hover:border-paper/40"
                >
                  Download CV
                  <HiDownload className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
            ) : null}
          </div>
        </div>

        <div
          data-hero-bottom
          className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6"
        >
          <ul className="flex items-center gap-1">
            {iconLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-lg text-muted transition-all hover:-translate-y-0.5 hover:border-line hover:text-paper"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>

          <p className="hidden items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-muted sm:flex">
            Scroll to explore
            <FaArrowDownLong className="animate-bounce text-accent" aria-hidden />
          </p>
        </div>
      </div>

      <Marquee
        items={heroMarqueeItems}
        className="relative z-10 border-t border-line bg-ink/70 py-4 backdrop-blur-sm"
        itemClassName="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted"
      />
    </section>
  );
}
