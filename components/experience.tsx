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
                <h3 className="font-semibold capitalize">{item.title}</h3>
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
