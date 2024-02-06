import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

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
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
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
    title: "Master of Computer Applications - MCA, Computer Engineering",
    location: "Rajkot, Gujarat",
    description:
      "",
    icon: React.createElement(LuGraduationCap),
    date: "2019",
  },
  {
    title: "Odoo Developer",
    location: "Emipro Technologies Pvt. Ltd.",
    description:
      "I worked as an Odoo Developer. I have implemented Amazon odoo connector app.",
    icon: React.createElement(CgWorkAlt),
    date: "2019 - 2020",
  },
  {
    title: "Software Engineer",
    location: "Wings Tech Solutions Pvt. Ltd.",
    description:
      "I worked as a Fullstack developer. I have implemented many web portal which is mostly built in ReactJS and NodeJS. Being a small tight-knit team, I got a chance to wear many hats, from requirement analysis to generating the build.",
    icon: React.createElement(FaReact),
    date: "2020 - 2021",
  },
  {
    title: "Software Engineer",
    location: "Simform Solutions LLP",
    description:
      "Working as a MERN stack developer. I have implemented many web portal which is mostly built in ReactJS and NodeJS Developed several quickweb apps within short timelines for multiple client requirements.",
    icon: React.createElement(FaReact),
    date: "2021 - Present",
  },
] as const;

export const projectsData = [
  {
    title: "Database Monitoring Web Application",
    description:
      "I worked as a full-stack developer on this startup project for 2 years. Users can give public feedback to companies.",
    tags: ["React", "GraphQL", "Jest", "Typescript", ".NET", "Azure"],
  },
  {
    title: "Online Training Platform",
    description:
      "Job board for remote developer jobs. I was the front-end developer. It has features like filtering, sorting and pagination.",
    tags: ["React", "Redux", "NodeJS", "Express", "Azure"]    
  },
  {
    title: "Social Media Platform",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["NodeJS", "Express", "Twillio", "AWS"]    
  },
  {
    title: "Online Workout Platform",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["NodeJS", "Express", "AWS"]
  },
  {
    title: "E-Commerce Platform",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["React", "Typescript", "Redux", "AWS"]
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "NextJs",
  "NodeJs",
  "Git",
  "Jest",
  "Tailwind",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Apollo",
  "Express",
  "PostgreSQL",
  "Twillo",
  "Python",
  "Django",
  "Framer Motion",
  "AWS",
  "Azure",
] as const;
