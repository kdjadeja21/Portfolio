import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { LuGraduationCap } from "react-icons/lu";

export { email, socialLinks } from "./site";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Products",
    hash: "#products",
  },
  {
    name: "Cursor",
    hash: "#cursor",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Cursor Ambassador",
    location: "Cursor",
    description:
      "Official Cursor Ambassador for India. Helps connect the local community with the Cursor team. Co-organized the official Cursor Hackathon Ahmedabad (18 Jul 2026, York IE): 1,100+ registrations, 138 check-ins, 35 teams. Built EventClaim for check-in and credit/offer distribution.",
    logoSrc: "/logos/cursor.svg",
    date: "May 2026 – Present",
  },
  {
    title: "Senior Software Engineer",
    location: "EPAM Systems",
    description:
      "Senior Software Engineer working with JavaScript, TypeScript, React, Next.js, Jest, and Redux.",
    logoSrc: "/logos/epam.png",
    date: "Feb 2025 – Present",
  },
  {
    title: "Senior Software Engineer",
    location: "Simform Solutions LLP",
    description:
      "Senior Software Engineer on client web applications, primarily React and Node.js, with a focus on delivery and collaboration.",
    logoSrc: "/logos/simform-mark.svg",
    date: "Mar 2024 – Jan 2025",
  },
  {
    title: "Software Engineer",
    location: "Simform Solutions LLP",
    description:
      "Software engineer on React and Node.js web portals, including several quick-turn apps for client requirements.",
    logoSrc: "/logos/simform-mark.svg",
    date: "Jun 2021 – Mar 2024",
  },
  {
    title: "Software Engineer",
    location: "Wings Tech Solutions Pvt. Ltd.",
    description:
      "Full-stack engineer on React and Node.js web portals. In a small team, covered work from requirement analysis through generating the build.",
    logoSrc: "/logos/wings-mark.svg",
    date: "Mar 2020 – May 2021",
  },
  {
    title: "Web Developer",
    location: "Emipro Technologies Pvt. Ltd.",
    description: "Web developer. Implemented an Amazon–Odoo connector app.",
    icon: React.createElement(CgWorkAlt),
    date: "Apr 2019 – Jan 2020",
  },
  {
    title: ".NET Developer (internship)",
    location: "Knovos",
    description: "Short .NET developer internship.",
    logoSrc: "/logos/knovos.png",
    date: "Jan 2019 – Apr 2019",
  },
  {
    title: "MCA, Computer Engineering",
    location: "Marwadi University, Rajkot, Gujarat",
    description: "",
    icon: React.createElement(LuGraduationCap),
    date: "2017 – 2019",
  },
] as const;

export type ProductItem = {
  title: string;
  description: string;
  tags: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
};

export const productsData: readonly ProductItem[] = [
  {
    title: "In-Hand Helper",
    description:
      "Salary impact dashboard that applies the 50% basic-salary rule and compares old vs new tax regimes.",
    tags: ["Next.js", "TypeScript", "Vercel"],
    liveUrl: "https://inhandsalary.vercel.app",
    imageUrl: "/products/in-hand-helper.png",
  },
  {
    title: "Backdrop Studio",
    description: "Image background tool with a dark, modern UI.",
    tags: ["Next.js", "Vercel"],
    liveUrl: "https://backdrop-studio.vercel.app",
    imageUrl: "/products/backdrop-studio.png",
  },
  {
    title: "SIP Calculator",
    description:
      "Live systematic investment plan calculator. Footer: Made in India by Krushnasinh Jadeja.",
    tags: ["React", "MUI", "Vercel"],
    liveUrl: "https://sip-calc.vercel.app",
    imageUrl: "/products/sip-calculator.png",
  },
  {
    title: "EventClaim",
    description:
      "Cursor Community check-in, coupon, and credit/offer distribution with admin Google login. Used at the official Cursor Hackathon Ahmedabad (18 Jul 2026, York IE): 1,100+ registrations, 138 check-ins, 35 teams. Also at claimflow-rust.vercel.app.",
    tags: ["Next.js", "Google Auth", "Vercel"],
    liveUrl: "https://eventclaim.vercel.app",
    githubUrl: "https://github.com/kdjadeja21/claimflow",
    imageUrl: "/products/eventclaim.png",
  },
  {
    title: "Router Pulse",
    description:
      "Home network / LAN device visibility. Public GitHub repo; no marketing URL.",
    tags: ["TypeScript", "Next.js"],
    githubUrl: "https://github.com/kdjadeja21/router-pulse",
    imageUrl: "/products/router-pulse.png",
  },
] as const;

export const projectsData = [
  {
    title: "Database Monitoring Web Application",
    description:
      "Frontend work on database performance monitoring for a data platform: fast root-cause analysis and visibility across the Microsoft data estate, environment health at a glance, storage forecasting, OS/virtual-environment contributors, proactive alerting, and high-impact query fixes.",
    tags: ["React", "GraphQL", "Jest", "TypeScript", ".NET", "Azure"],
  },
  {
    title: "Online Training Platform",
    description:
      "Full-stack online platform for US police personnel training. Admins add trainees, who unlock programs as they complete sessions. Trainees track performance and attend free and paid sessions. Admins oversee progress and analytic reports.",
    tags: ["React", "Redux", "Node.js", "Express", "Azure"],
  },
  {
    title: "E-Commerce Platform",
    description:
      "Marketplace where merchants connect with buyers. Merchants register, upload products, and manage orders and payments. Buyers browse categories, add products from multiple merchants, and complete payment online.",
    tags: ["React", "TypeScript", "Redux", "AWS"],
  },
] as const;

export const skillsData = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind",
  "Jest",
  "Redux",
  "GraphQL",
  "Vercel",
  "Cursor",
  "AI consulting",
  "PostgreSQL",
  "MongoDB",
  "Express",
  "AWS",
  "Azure",
  "Apollo",
] as const;

export const cursorCommunity = {
  statsAsOf: "15 Aug 2026",
  profileUrl: "https://cursor.com/@kdjadeja",
  directoryUrl: "https://cursor.directory/u/kdjadeja21",
  xUrl: "https://x.com/kdjadeja911",
  xDisplay: "@KdJadeja911",
  agents: 179,
  localAgents: 114,
  cloudAgents: 65,
  longestAgent: "6.5h",
  streakDays: 27,
  tokens: "602.8M",
  joinedDaysAgo: 616,
  hackathon:
    "Co-organized the official Cursor Hackathon Ahmedabad (18 Jul 2026, York IE) and shipped EventClaim as the check-in and credit/offer ops tool.",
} as const;
