"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { cursorCommunity } from "@/lib/data";
import CursorMark from "./cursor-mark";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

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
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-2 rounded-full borderBlack bg-white px-4 py-2 text-sm font-medium dark:bg-white/10">
          <CursorMark className="text-base" />
          Official Cursor Ambassador
        </span>
      </div>
      <SectionHeading>Cursor</SectionHeading>
      <p className="mb-6 leading-8 text-gray-700 dark:text-white/80">
        I represent Cursor in India and help connect the local community with
        the Cursor team. {cursorCommunity.hackathon} Profile:{" "}
        <a
          className="font-medium underline underline-offset-4"
          href={cursorCommunity.profileUrl}
          target="_blank"
          rel="noreferrer"
        >
          cursor.com/@kdjadeja
        </a>
        .
      </p>
      <p className="mb-8 text-sm text-gray-500 dark:text-white/50">
        Stats from the official Cursor profile as of{" "}
        {cursorCommunity.statsAsOf} — not live counters.
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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition text-sm font-medium"
          href={cursorCommunity.profileUrl}
          target="_blank"
          rel="noreferrer"
        >
          <CursorMark />
          cursor.com/@kdjadeja
          <HiArrowTopRightOnSquare className="opacity-70" />
        </a>
        <a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 text-sm font-medium"
          href="https://cursor.com"
          target="_blank"
          rel="noreferrer"
        >
          cursor.com
        </a>
        <a
          className="underline underline-offset-4 text-sm font-medium"
          href={cursorCommunity.directoryUrl}
          target="_blank"
          rel="noreferrer"
        >
          cursor.directory
        </a>
        <a
          className="underline underline-offset-4 text-sm font-medium"
          href={cursorCommunity.xUrl}
          target="_blank"
          rel="noreferrer"
        >
          {cursorCommunity.xDisplay}
        </a>
      </div>
    </motion.section>
  );
}
