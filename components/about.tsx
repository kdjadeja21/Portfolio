"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        I&apos;m a senior software engineer and AI consultant in Gujarat, India,
        with 7+ years shipping production systems. I completed an{" "}
        <span className="font-medium">
          MCA in Computer Engineering at Marwadi University
        </span>
        , and I currently work at{" "}
        <span className="font-medium">EPAM Systems</span> while serving as an{" "}
        <span className="font-medium">official Cursor Ambassador</span> for the
        India community.
      </p>
      <p className="mb-3">
        I help organisations adopt{" "}
        <a
          className="underline underline-offset-4"
          href="https://cursor.com"
          target="_blank"
          rel="noreferrer"
        >
          Cursor
        </a>{" "}
        and build automation around delivery — from event ops tools like{" "}
        <span className="font-medium">EventClaim</span> to the small public
        products I ship when a problem is worth solving. Day to day I work in
        TypeScript and React, with a strong bias toward AI-assisted engineering.
      </p>
      <p className="mb-3">
        I use{" "}
        <a
          className="underline underline-offset-4"
          href="https://x.ai/bot"
          target="_blank"
          rel="noreferrer"
        >
          Grok&apos;s bot
        </a>{" "}
        heavily to automate repetitive work, reminders, and similar tasks.
      </p>
      <p>
        <span className="italic">When I&apos;m not coding</span>, I enjoy
        playing video games and watching movies.
      </p>
    </motion.section>
  );
}
