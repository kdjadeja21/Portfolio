import Hero from "@/components/hero";
import About from "@/components/about";
import Products from "@/components/products";
import CursorCommunity from "@/components/cursor";
import Work from "@/components/work";
import Skills from "@/components/skills";
import Experience from "@/components/experience";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <main id="main" className="relative">
      <Hero />
      <About />
      <Products />
      <CursorCommunity />
      <Work />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
