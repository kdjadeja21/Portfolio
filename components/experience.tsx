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

function PresentRibbon({
  background,
  color,
}: {
  background: string;
  color: string;
}) {
  return (
    <span
      aria-label="Present"
      className="pointer-events-none absolute top-[0.85rem] -right-7 w-[6.5rem] rotate-45 py-[0.28rem] text-center text-[0.62rem] font-semibold tracking-[0.08em] shadow-sm"
      style={{ background, color }}
    >
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
          const cardBackground = isCurrent
            ? isLight
              ? "#ffffff"
              : "rgba(255, 255, 255, 0.09)"
            : isLight
              ? "#f3f4f6"
              : "rgba(255, 255, 255, 0.05)";
          const accent = isCurrent
            ? isLight
              ? "#6d5bdb"
              : "#c4b5fd"
            : isLight
              ? "#9ca3af"
              : "rgba(255, 255, 255, 0.32)";
          const ribbonColor = isLight ? "#ffffff" : "#1e1b4b";
          const arrowFill = isCurrent
            ? isLight
              ? "#ffffff"
              : "#2c3344"
            : isLight
              ? "#f3f4f6"
              : "#252b38";

          return (
            <React.Fragment key={index}>
              <VerticalTimelineElement
                contentStyle={{
                  background: cardBackground,
                  boxShadow: `inset 3px 0 0 ${accent}`,
                  border: isLight
                    ? "1px solid rgba(0, 0, 0, 0.05)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                  textAlign: "left",
                  padding: isCurrent
                    ? "1.3rem 3.25rem 1.3rem 2rem"
                    : "1.3rem 2rem",
                  position: "relative",
                  overflow: "visible",
                  ["--experience-arrow" as string]: arrowFill,
                }}
                contentArrowStyle={{
                  borderRightColor: arrowFill,
                }}
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
                {isCurrent ? (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[0.25em]">
                    <PresentRibbon
                      background={accent}
                      color={ribbonColor}
                    />
                  </div>
                ) : null}
                <h3 className="font-semibold capitalize">{item.title}</h3>
                <p className="font-normal !mt-0">{item.location}</p>
                <p className="!mt-1 !font-semibold text-sm text-gray-800 dark:text-white/80">
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
