"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { productsData } from "@/lib/data";
import Product from "./product";
import { useSectionInView } from "@/lib/hooks";

export default function Products() {
  const { ref } = useSectionInView("Products");

  return (
    <section id="products" className="scroll-mt-28 mb-28">
      <div ref={ref}>
        <SectionHeading>Products I&apos;ve shipped</SectionHeading>
      </div>
      <div>
        {productsData.map((product, index) => (
          <React.Fragment key={index}>
            <Product {...product} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
