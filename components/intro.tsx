"use client";

import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { socialLinks, showCvDownload, cvDownloadPath } from "@/lib/site";
import CursorMark from "./cursor-mark";

const linkedInUrl = socialLinks.find((link) => link.name === "LinkedIn")!.url;
const githubUrl = socialLinks.find((link) => link.name === "GitHub")!.url;
const xUrl = socialLinks.find((link) => link.name === "X")!.url;
const cursorUrl = socialLinks.find((link) => link.name === "Cursor")!.url;

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src="/Mimoji-removebg-preview.png"
              alt="Krushnasinh Jadeja portrait"
              width="192"
              height="192"
              quality="95"
              priority={true}
              className="h-24 w-24 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-0 text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="block font-bold">Hello, I&apos;m Krushnasinh.</span>
        <span className="mt-2 block text-xl sm:text-3xl">
          Senior Software Engineer · Cursor Ambassador · AI Consultant
        </span>
        <span className="mt-4 block text-lg font-normal sm:text-2xl">
          I build production software, consult on AI-assisted engineering, and
          help organisations automate the work around shipping.
        </span>
      </motion.h1>

      <motion.div
        className="flex flex-col items-center gap-4 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <Link
            href="#contact"
            className="group bg-gray-900 text-white px-7 py-3 flex items-center justify-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition min-w-[12.5rem]"
            onClick={() => {
              setActiveSection("Contact");
              setTimeOfLastClick(Date.now());
            }}
          >
            Contact{" "}
            <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
          </Link>

          {showCvDownload ? (
            <a
              className="group bg-white px-7 py-3 flex items-center justify-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 min-w-[12.5rem]"
              href={cvDownloadPath}
              download
            >
              Download CV{" "}
              <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
            </a>
          ) : null}
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <a
            className="bg-white p-3 sm:p-4 text-gray-700 hover:text-gray-950 flex items-center justify-center rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <BsLinkedin />
          </a>

          <a
            className="bg-white p-3 sm:p-4 text-gray-700 flex items-center justify-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={xUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="X"
          >
            <FaXTwitter />
          </a>

          <a
            className="bg-white p-3 sm:p-4 text-gray-700 flex items-center justify-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithubSquare />
          </a>

          <a
            className="bg-white p-3 sm:p-4 text-gray-700 flex items-center justify-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={cursorUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Official Cursor profile"
          >
            <CursorMark />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
