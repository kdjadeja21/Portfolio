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
        I&apos;m a senior software engineer in Gujarat, India, with 7+ years
        building production web apps. I completed an{" "}
        <span className="font-medium">
          MCA in Computer Engineering at Marwadi University
        </span>
        , and I currently work at{" "}
        <span className="font-medium">EPAM Systems</span> while serving as a{" "}
        <span className="font-medium">Cursor Ambassador</span> for the India
        community.
      </p>
      <p className="mb-3">
        I ship small public tools when a problem is worth solving — including{" "}
        <span className="font-medium">EventClaim</span>, which we used for
        check-in and credit distribution at Cursor Hackathon Ahmedabad. Day to
        day I work with TypeScript, React, and Next.js, often with AI-assisted
        workflows.
      </p>
      <p>
        <span className="italic">When I&apos;m not coding</span>, I enjoy
        playing video games and watching movies.
      </p>
    </motion.section>
  );
}
