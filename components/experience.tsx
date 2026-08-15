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
        width={64}
        height={64}
        className={className}
        unoptimized
      />
    );
  }

  return null;
}

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  const { theme } = useTheme();

  return (
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40">
      <div ref={ref}>
        <SectionHeading>My experience</SectionHeading>
      </div>
      <VerticalTimeline lineColor="">
        {experiencesData?.map((item, index) => {
          const emphasized =
            "logoEmphasis" in item && Boolean(item.logoEmphasis);

          return (
            <React.Fragment key={index}>
              <VerticalTimelineElement
                contentStyle={{
                  background:
                    theme === "light"
                      ? "#f3f4f6"
                      : "rgba(255, 255, 255, 0.05)",
                  boxShadow: "none",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  textAlign: "left",
                  padding: "1.3rem 2rem",
                }}
                contentArrowStyle={{
                  borderRight:
                    theme === "light"
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
                  width: emphasized ? "4rem" : "2.75rem",
                  height: emphasized ? "4rem" : "2.75rem",
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
