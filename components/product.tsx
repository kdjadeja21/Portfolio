"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductItem } from "@/lib/data";
import { motion, useScroll, useTransform } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

type ProductProps = ProductItem;

export default function Product({
  title,
  description,
  tags,
  liveUrl,
  githubUrl,
  imageUrl,
}: ProductProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="group mb-3 sm:mb-8 last:mb-0"
    >
      <section className="bg-gray-100 max-w-[42rem] border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative min-h-[18rem] sm:min-h-[22rem] hover:bg-gray-200 transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[18rem]">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:mt-auto sm:pt-6">
            {liveUrl || githubUrl ? (
              <div className="flex flex-wrap gap-2">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-950 dark:bg-white/15 dark:hover:bg-white/25"
                  >
                    Live
                    <HiArrowTopRightOnSquare className="text-xs opacity-80" />
                  </a>
                ) : null}
                {githubUrl ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 dark:border-white/15 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
                  >
                    GitHub
                    <FaGithub className="text-xs opacity-80" />
                  </a>
                ) : null}
              </div>
            ) : null}
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <li
                  className="rounded-full bg-black/[0.07] px-3 py-1 text-[0.7rem] font-medium tracking-wide text-gray-700 dark:bg-white/10 dark:text-white/60"
                  key={index}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Image
          src={imageUrl}
          alt={`${title} screenshot`}
          width={640}
          height={400}
          quality={95}
          className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl
        transition
        group-hover:scale-[1.04]
        group-hover:-translate-x-3
        group-hover:translate-y-3
        group-hover:-rotate-2
        group-even:group-hover:translate-x-3
        group-even:group-hover:translate-y-3
        group-even:group-hover:rotate-2
        group-even:right-[initial] group-even:-left-40"
        />
      </section>
    </motion.div>
  );
}
