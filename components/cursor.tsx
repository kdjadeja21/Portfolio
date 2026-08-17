"use client";

import Image from "next/image";
import { motion } from "motion/react";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";

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
      <div className="mb-6 flex justify-center">
        <Image
          src="/logos/cursor.svg"
          alt="Cursor"
          width={72}
          height={72}
          className="h-[4.5rem] w-[4.5rem]"
          unoptimized
        />
      </div>
      <SectionHeading>Cursor Ambassador</SectionHeading>
      <p className="mb-4 text-gray-700 dark:text-white/80">
        I&apos;m a{" "}
        <span className="font-medium">Cursor Ambassador</span> in India. I help
        developers get productive with{" "}
        <a
          className="underline underline-offset-4"
          href="https://cursor.com"
          target="_blank"
          rel="noreferrer"
        >
          Cursor
        </a>
        , and I help organisations build automation around their engineering
        work — check-in flows, credit distribution, and the operational glue
        that usually lives in a spreadsheet.
      </p>
      <p className="text-gray-700 dark:text-white/80">
        In July 2026 I co-organized the Cursor Hackathon in Ahmedabad at York
        IE: 1,100+ registrations, 138 check-ins, 35 teams.{" "}
        <a
          className="underline underline-offset-4"
          href="https://eventclaim.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          EventClaim
        </a>{" "}
        was the ops tool for that day.
      </p>
    </motion.section>
  );
}
