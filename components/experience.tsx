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
    return (
      <Image
        src={item.logoSrc}
        alt=""
        width={40}
        height={40}
        className="h-8 w-8 object-contain"
        unoptimized
      />
    );
  }

  return null;
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
                      : "rgba(255, 255, 255, 0.12)"
                    : isLight
                      ? "#f3f4f6"
                      : "rgba(255, 255, 255, 0.05)",
                  boxShadow: isCurrent
                    ? isLight
                      ? "0 8px 24px rgba(15, 23, 42, 0.08)"
                      : "0 8px 24px rgba(0, 0, 0, 0.28)"
                    : "none",
                  border: isCurrent
                    ? isLight
                      ? "2px solid rgba(17, 24, 39, 0.88)"
                      : "2px solid rgba(255, 255, 255, 0.55)"
                    : "1px solid rgba(0, 0, 0, 0.05)",
                  textAlign: "left",
                  padding: "1.3rem 2rem",
                }}
                contentArrowStyle={{
                  borderRight: isCurrent
                    ? isLight
                      ? "0.4rem solid #111827"
                      : "0.4rem solid rgba(255, 255, 255, 0.7)"
                    : isLight
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
                  boxShadow: isCurrent
                    ? isLight
                      ? "0 0 0 3px #111827"
                      : "0 0 0 3px rgba(255, 255, 255, 0.7)"
                    : undefined,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold capitalize">{item.title}</h3>
                  {isCurrent ? (
                    <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-gray-950">
                      Present
                    </span>
                  ) : null}
                </div>
                <p className="font-normal !mt-0">{item.location}</p>
                {item.description ? (
                  <p className="!mt-1 !font-normal text-gray-700 dark:text-white/75">
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
