"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionHeading from "./section-heading";
import { productsData, type ProductItem } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Products() {
  const { ref } = useSectionInView("Products", 0.1);

  return (
    <section
      ref={ref}
      id="products"
      aria-label="Products I have shipped"
      className="relative border-t border-line px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="02"
            eyebrow="Products"
            title="Things I've shipped"
          />
          <p className="max-w-xs pb-2 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.2em] text-muted">
            Small public products, built end-to-end and live on the internet.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-6 lg:mt-24 lg:gap-10">
          {productsData.map((product, index) => (
            <ProductCard key={product.title} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: ProductItem;
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(cardRef.current, {
          y: 80,
          opacity: 0,
          scale: 0.97,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
          },
        });

        gsap.fromTo(
          "[data-product-image]",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: cardRef }
  );

  return (
    <article
      ref={cardRef}
      className="group/card lg:sticky"
      style={{ top: `${96 + index * 20}px` }}
    >
      <div className="grid overflow-hidden rounded-3xl border border-line bg-elevated transition-colors duration-500 hover:border-paper/25 lg:grid-cols-2">
        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              {product.title}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-paper/70">
              {product.description}
            </p>
            {product.highlight ? (
              <p className="mt-4 max-w-md border-l-2 border-accent pl-4 font-mono text-xs leading-relaxed text-accent/90">
                {product.highlight}
              </p>
            ) : null}
          </div>

          <div className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-5">
              {product.liveUrl ? (
                <a
                  href={product.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-paper"
                >
                  <span className="link-underline">Visit live</span>
                  <HiArrowUpRight className="text-accent transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              ) : null}
              {product.githubUrl ? (
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-paper"
                >
                  <FaGithub className="text-sm" aria-hidden />
                  <span className="link-underline">Source</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative min-h-[16rem] overflow-hidden border-t border-line bg-surface sm:min-h-[20rem] lg:border-l lg:border-t-0">
          <div data-product-image className="absolute inset-[-8%]">
            <Image
              src={product.imageUrl}
              alt={`${product.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              quality={90}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-elevated/50 to-transparent opacity-60 transition-opacity duration-500 group-hover/card:opacity-0"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
