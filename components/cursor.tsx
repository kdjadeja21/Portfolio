"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { cursorCommunity } from "@/lib/data";

export default function CursorCommunity() {
  const { ref } = useSectionInView("Cursor");

  return (
    <motion.section
      ref={ref}
      id="cursor"
      className="mb-28 max-w-[45rem] scroll-mt-28 text-center leading-8 sm:mb-40"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <SectionHeading>Cursor Ambassador</SectionHeading>
      <p className="mb-4 text-gray-700 dark:text-white/80">
        I&apos;m a{" "}
        <span className="font-medium">Cursor Ambassador</span> in India — I
        help developers get productive with{" "}
        <a
          className="underline underline-offset-4"
          href="https://cursor.com"
          target="_blank"
          rel="noreferrer"
        >
          Cursor
        </a>{" "}
        and keep a short loop between the local community and the Cursor team.
        My public profile is{" "}
        <a
          className="underline underline-offset-4"
          href={cursorCommunity.profileUrl}
          target="_blank"
          rel="noreferrer"
        >
          cursor.com/@kdjadeja
        </a>
        .
      </p>
      <p className="mb-4 text-gray-700 dark:text-white/80">
        In July 2026 I co-organized the Cursor Hackathon in Ahmedabad at York
        IE. We had 1,100+ registrations, 138 check-ins, and 35 teams. I also
        shipped{" "}
        <a
          className="underline underline-offset-4"
          href="https://eventclaim.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          EventClaim
        </a>{" "}
        so check-in and credit/offer distribution didn&apos;t have to be a
        spreadsheet.
      </p>
      <p className="text-gray-700 dark:text-white/80">
        On that profile as of {cursorCommunity.statsAsOf}:{" "}
        {cursorCommunity.agents} agents ({cursorCommunity.localAgents} local /{" "}
        {cursorCommunity.cloudAgents} cloud), longest agent{" "}
        {cursorCommunity.longestAgent}, a {cursorCommunity.streakDays}-day
        streak, {cursorCommunity.tokens} tokens, joined about{" "}
        {cursorCommunity.joinedDaysAgo} days ago. Also on{" "}
        <a
          className="underline underline-offset-4"
          href={cursorCommunity.directoryUrl}
          target="_blank"
          rel="noreferrer"
        >
          cursor.directory
        </a>{" "}
        and{" "}
        <a
          className="underline underline-offset-4"
          href={cursorCommunity.xUrl}
          target="_blank"
          rel="noreferrer"
        >
          {cursorCommunity.xDisplay}
        </a>
        .
      </p>
    </motion.section>
  );
}
