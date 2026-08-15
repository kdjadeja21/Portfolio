"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "./section-heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";

function ExperienceIcon({
  item,
}: {
  item: (typeof experiencesData)[number];
}) {
  if ("logoSrc" in item && item.logoSrc) {
    const className =
      "logoClassName" in item && item.logoClassName
        ? item.logoClassName
        : "h-8 w-8 object-contain";

    return (
      <Image
        src={item.logoSrc}
        alt=""
        width={80}
        height={40}
        className={className}
        unoptimized
      />
    );
  }

  return null;
}

function PresentBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.7rem] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Present
    </span>
  );
}

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40">
      <div ref={ref}>
        <SectionHeading>My experience</SectionHeading>
      </div>
      <VerticalTimeline lineColor="">
        {experiencesData?.map((item, index) => {
          const isCurrent = item.date.includes("Present");

          return (
            <React.Fragment key={index}>
              <VerticalTimelineElement
                contentStyle={{
                  background: isCurrent
                    ? isLight
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.09)"
                    : isLight
                      ? "#f3f4f6"
                      : "rgba(255, 255, 255, 0.05)",
                  boxShadow: isCurrent
                    ? isLight
                      ? "inset 3px 0 0 #6d5bdb"
                      : "inset 3px 0 0 rgba(196, 181, 253, 0.9)"
                    : "none",
                  border: isLight
                    ? "1px solid rgba(0, 0, 0, 0.05)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                  textAlign: "left",
                  padding: "1.3rem 2rem",
                }}
                contentArrowStyle={{
                  borderRight: isLight
                    ? "0.4rem solid #9ca3af"
                    : "0.4rem solid rgba(255, 255, 255, 0.5)",
                }}
                date={item.date}
                icon={<ExperienceIcon item={item} />}
                iconStyle={{
                  background: "white",
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  width: "2.75rem",
                  height: "2.75rem",
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold capitalize">{item.title}</h3>
                  {isCurrent ? <PresentBadge /> : null}
                </div>
                <p className="font-normal !mt-0">{item.location}</p>
                <p className="!mt-1 !font-medium text-sm text-gray-500 dark:text-white/55">
                  {item.date}
                </p>
                {item.description ? (
                  <p className="!mt-2 !font-normal text-gray-700 dark:text-white/75">
                    {item.description}
                  </p>
                ) : null}
              </VerticalTimelineElement>
            </React.Fragment>
          );
        })}
      </VerticalTimeline>
    </section>
  );
}
