"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { cursorCommunity } from "@/lib/data";

const stats = [
  {
    label: "Agents",
    value: `${cursorCommunity.agents}`,
    detail: `${cursorCommunity.localAgents} local / ${cursorCommunity.cloudAgents} cloud`,
  },
  {
    label: "Longest agent",
    value: cursorCommunity.longestAgent,
  },
  {
    label: "Streak",
    value: `${cursorCommunity.streakDays}-day`,
  },
  {
    label: "Tokens",
    value: cursorCommunity.tokens,
  },
  {
    label: "Joined",
    value: `~${cursorCommunity.joinedDaysAgo} days ago`,
  },
] as const;

export default function CursorCommunity() {
  const { ref } = useSectionInView("Cursor");

  return (
    <motion.section
      ref={ref}
      id="cursor"
      className="mb-28 max-w-[45rem] scroll-mt-28 text-center sm:mb-40"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <SectionHeading>Cursor Ambassador</SectionHeading>
      <p className="mb-6 leading-8 text-gray-700 dark:text-white/80">
        I help connect the India Cursor community with the Cursor team.{" "}
        {cursorCommunity.hackathon}
      </p>
      <p className="mb-8 text-sm text-gray-500 dark:text-white/50">
        Profile stats as of {cursorCommunity.statsAsOf} — not live counters.
      </p>
      <ul className="flex flex-wrap justify-center gap-3 mb-8">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80 min-w-[8.5rem]"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/50">
              {stat.label}
            </div>
            <div className="font-medium">{stat.value}</div>
            {"detail" in stat && stat.detail ? (
              <div className="text-xs text-gray-500 dark:text-white/50">
                {stat.detail}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium">
        <a
          className="underline underline-offset-4"
          href={cursorCommunity.profileUrl}
          target="_blank"
          rel="noreferrer"
        >
          cursor.com/@kdjadeja
        </a>
        <a
          className="underline underline-offset-4"
          href={cursorCommunity.directoryUrl}
          target="_blank"
          rel="noreferrer"
        >
          cursor.directory
        </a>
        <a
          className="underline underline-offset-4"
          href={cursorCommunity.xUrl}
          target="_blank"
          rel="noreferrer"
        >
          {cursorCommunity.xDisplay}
        </a>
      </p>
    </motion.section>
  );
}
