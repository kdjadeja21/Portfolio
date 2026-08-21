"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useSectionInView } from "@/lib/hooks";
import { cursorStats, cursorStatsAsOf, type CursorStat } from "@/lib/data";
import { socialLinks } from "@/lib/site";

const cursorProfileUrl = socialLinks.find((link) => link.name === "Cursor")!.url;

function formatStat(stat: CursorStat, value: number) {
  const formatted =
    (stat.decimals ?? 0) > 0
      ? value.toFixed(stat.decimals)
      : Math.round(value).toLocaleString("en-US");
  return `${stat.prefix ?? ""}${formatted}${stat.suffix ?? ""}`;
}

export default function CursorCommunity() {
  const { ref } = useSectionInView("Cursor", 0.3);
  const sectionRef = useRef<HTMLElement>(null);

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node;
    ref(node);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-cursor-band]", {
          y: 90,
          opacity: 0,
          scale: 0.98,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
          },
        });

        const counters =
          gsap.utils.toArray<HTMLElement>("[data-stat-counter]");
        for (const counter of counters) {
          const statIndex = Number(counter.dataset.statIndex);
          const stat = cursorStats[statIndex];
          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: stat.value,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: counter,
              start: "top 92%",
            },
            onUpdate: () => {
              counter.textContent = formatStat(stat, proxy.value);
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
      id="cursor"
      aria-label="Cursor Ambassador"
      className="relative px-4 py-12 sm:px-6 sm:py-16"
    >
      <div
        data-cursor-band
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cursor-paper/15 bg-cursor-ink text-cursor-paper"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(237_236_236/0.07),transparent_55%)]"
          aria-hidden
        />

        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:p-16">
          <div>
            <p className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cursor-paper/50">
              <Image
                src="/logos/cursor.svg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
                unoptimized
                aria-hidden
              />
              03 / Community
            </p>
            <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Cursor
              <br />
              Ambassador
            </h2>

            <p className="mt-8 max-w-lg leading-relaxed text-cursor-paper/70">
              Official Cursor Ambassador for India, with an active community of
              1000+ members. I help developers get productive with{" "}
              <a
                className="font-medium text-cursor-paper underline underline-offset-4"
                href="https://cursor.com"
                target="_blank"
                rel="noreferrer"
              >
                Cursor
              </a>
              , and help organisations build automation around their
              engineering work — check-in flows, credit distribution, and the
              operational glue that usually lives in a spreadsheet.
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-cursor-paper/70">
              In July 2026 I co-organized the Cursor Hackathon in Ahmedabad at
              York IE —{" "}
              <a
                className="font-medium text-cursor-paper underline underline-offset-4"
                href="https://eventclaim.vercel.app"
                target="_blank"
                rel="noreferrer"
              >
                EventClaim
              </a>{" "}
              was the ops tool for that day.
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-cursor-paper/70">
              I also build for the agent ecosystem itself — like my{" "}
              <a
                className="font-medium text-cursor-paper underline underline-offset-4"
                href="https://github.com/kdjadeja21/product-demo-video-agent-plugin"
                target="_blank"
                rel="noreferrer"
              >
                product-demo-video agent plugin
              </a>
              , which turns a config file into narrated 1080p demo videos
              linked right in your PR.
            </p>

            <a
              href={cursorProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-cursor-paper/25 px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.18em] transition-all hover:bg-cursor-paper hover:text-cursor-ink"
            >
              cursor.com/@kdjadeja
              <HiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cursor-paper/12 bg-cursor-paper/12">
              {cursorStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex flex-col bg-cursor-ink p-5 sm:p-6"
                >
                  <dd
                    data-stat-counter
                    data-stat-index={index}
                    className="order-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
                  >
                    {formatStat(stat, stat.value)}
                  </dd>
                  <dt className="order-2 mt-2 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.16em] text-cursor-paper/50">
                    {stat.label}
                    {stat.sublabel ? (
                      <span className="mt-0.5 block text-cursor-paper/35">
                        {stat.sublabel}
                      </span>
                    ) : null}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-right font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cursor-paper/40">
              {cursorStatsAsOf}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
