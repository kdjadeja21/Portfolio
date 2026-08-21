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

export const heroRoles = [
  "Senior Software Engineer",
  "Cursor Ambassador",
  "AI Consultant",
] as const;

export const heroMarqueeItems = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "GraphQL",
  "AI-assisted engineering",
  "Cursor",
  "7+ years shipping",
] as const;

export const experiencesData = [
  {
    title: "Cursor Ambassador",
    location: "Cursor",
    description:
      "Official Cursor Ambassador for India, with an active community of 1000+ members. Helps connect the local community with the Cursor team and helps organisations build automation. Built EventClaim for check-in and credit/offer distribution.",
    logoSrc: "/logos/cursor.svg",
    date: "May 2026 – Present",
  },
  {
    title: "Senior Software Engineer",
    location: "EPAM Systems",
    description:
      "Senior Software Engineer working with JavaScript, TypeScript, React, Next.js, Jest, and Redux. Works with Schneider Electric, Wayfair, and Avis Budget Group clients.",
    logoSrc: "/logos/epam.svg",
    logoClassName: "h-[0.8rem] w-[2.1rem] object-contain",
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
    logoSrc: "/logos/emipro.png",
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
    logoSrc: "/logos/marwadi.png",
    date: "2017 – 2019",
  },
] as const;

export type ProductItem = {
  title: string;
  description: string;
  highlight?: string;
  tags: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
};

export const productsData: readonly ProductItem[] = [
  {
    title: "EventClaim",
    description:
      "Check-in, coupon, and credit/offer distribution platform for the Cursor community, with admin Google login.",
    highlight:
      "Ran ops for the official Cursor Hackathon Ahmedabad — 1,100+ registrations, 138 check-ins, 35 teams.",
    tags: ["React", "Google Auth"],
    liveUrl: "https://eventclaim.vercel.app",
    githubUrl: "https://github.com/kdjadeja21/claimflow",
    imageUrl: "/products/eventclaim.png",
  },
  {
    title: "In-Hand Helper",
    description:
      "Salary impact dashboard that applies the 50% basic-salary rule and compares old vs new tax regimes.",
    tags: ["TypeScript", "React"],
    liveUrl: "https://inhandsalary.vercel.app",
    imageUrl: "/products/in-hand-helper.png",
  },
  {
    title: "Backdrop Studio",
    description: "Image background tool with a dark, modern editing UI.",
    tags: ["React"],
    liveUrl: "https://backdrop-studio.vercel.app",
    imageUrl: "/products/backdrop-studio.png",
  },
  {
    title: "SIP Calculator",
    description:
      "Live systematic investment plan calculator for planning investments over time.",
    tags: ["React", "MUI", "Vercel"],
    liveUrl: "https://sip-calc.vercel.app",
    imageUrl: "/products/sip-calculator.png",
  },
  {
    title: "Router Pulse",
    description:
      "Home network and LAN device visibility, open source on GitHub.",
    tags: ["TypeScript"],
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

export type CursorStat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
};

export const cursorStats: readonly CursorStat[] = [
  {
    value: 179,
    label: "Agents run",
    sublabel: "114 local / 65 cloud",
  },
  {
    value: 602.8,
    decimals: 1,
    suffix: "M",
    label: "Tokens used",
  },
  {
    value: 27,
    label: "Day streak",
  },
  {
    value: 1100,
    suffix: "+",
    label: "Hackathon registrations",
    sublabel: "Cursor Hackathon Ahmedabad",
  },
  {
    value: 138,
    label: "Hackathon check-ins",
  },
  {
    value: 35,
    label: "Hackathon teams",
  },
] as const;

export const cursorStatsAsOf = "Stats as of 15 Aug 2026";

export type CoreSkill = {
  name: string;
  note: string;
};

export const coreSkills: readonly CoreSkill[] = [
  { name: "TypeScript", note: "Type-safe everything" },
  { name: "React", note: "UI engineering" },
  { name: "Next.js", note: "App Router / RSC" },
  { name: "Node.js", note: "APIs & services" },
  { name: "GraphQL", note: "Data layer" },
  { name: "Cursor", note: "AI-assisted engineering" },
] as const;

export const toolboxSkills = [
  "JavaScript",
  "Jest",
  "Redux",
  "Apollo",
  "Express",
  "PostgreSQL",
  "MongoDB",
  "Tailwind CSS",
  "AWS",
  "Azure",
  "Vercel",
  "AI consulting",
] as const;
