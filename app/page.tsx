import About from "@/components/about";
import Contact from "@/components/contact";
import CursorCommunity from "@/components/cursor";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Products from "@/components/products";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <Intro />
      <SectionDivider />
      <About />
      <Products />
      <CursorCommunity />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
