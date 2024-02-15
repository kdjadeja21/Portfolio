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
    title: "Associate Team Leader",
    location: "Simform Solutions LLP",
    description:
      "As an Associate Team Leader, I oversee a team of 20 members, coordinating efforts to develop tailored software architectures that meet our clients' specific requirements. Collaborating closely with clients, I ensure a thorough understanding of their needs, facilitating effective communication and project management throughout the development lifecycle. My primary focus is on delivering solutions that align precisely with client expectations, leveraging efficient workflows and proactive problem-solving to achieve successful outcomes.",
    icon: React.createElement(FaReact),
    date: "2023 - Present",
  },
  {
    title: "Software Engineer",
    location: "Simform Solutions LLP",
    description:
      "Working as a MERN stack developer. I have implemented many web portal which is mostly built in ReactJS and NodeJS Developed several quickweb apps within short timelines for multiple client requirements.",
    icon: React.createElement(FaReact),
    date: "2021 - 2023",
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
    title: "Web Developer",
    location: "Emipro Technologies Pvt. Ltd.",
    description:
      "I worked as a Web Developer. I have implemented Amazon odoo connector app.",
    icon: React.createElement(CgWorkAlt),
    date: "2019 - 2020",
  },
  {
    title: "Master of Computer Applications - MCA, Computer Engineering",
    location: "Rajkot, Gujarat",
    description:
      "",
    icon: React.createElement(LuGraduationCap),
    date: "2019",
  },  
] as const;

export const projectsData = [
  {
    title: "Database Monitoring Web Application",
    description:
      "I worked as a frontend developer on this product. Database performance monitoring for the Data Platform, with fast root cause analysis and visibility across the Microsoft data estate. At-a-glance view of database environment health. Storage forecasting powered by predictive analytics. Identify contributing problems in the OS and virtual environment. Proactive alerting and response system. Find and fix high-impact queries.",
    tags: ["React", "GraphQL", "Jest", "Typescript", ".NET", "Azure"],
  },
  {
    title: "Online Training Platform",
    description:
      "As a fullstack developer, I built an online platform for US police personnel training. Admins add trainees, who can then access locked programs. Completing each program unlocks more sessions. Trainees can track their performance and attend both free and paid sessions. Admins oversee trainee progress and access analytic reports.",
    tags: ["React", "Redux", "NodeJS", "Express", "Azure"]    
  },
  {
    title: "Social Media Platform",
    description:
      "It is an application that enables users to connect with other users and ask for help when they are in danger. Users can register themselves, connect with other users, like/comment/share other users' posts, upload posts. Users can exchange text messages with each other. On being in a dangerous position, user can ask for help that enables alert notification to other users in the proximity who are using the application.",
    tags: ["NodeJS", "Express", "Twillio", "AWS"]
  },
  {
    title: "Online Workout Platform",
    description:
      "It is a subscription base workout App. In this app admin can upload the workout videos and user will get that videos and also push notifications for that new workout as well. Some features include Workout videos, new workout push notifications, complete workout trackers, Save your workouts for later, set a weekly goal, Weight Tracker and many more.",
    tags: ["NodeJS", "Express", "AWS"]
  },
  {
    title: "E-Commerce Platform",
    description:
      "A marketplace platform that facilitates merchants to connect with buyers for their products. Merchants can register and upload their products with their details, and images. Each merchant can manage their orders and payment transactions within the platform. Buyers can browse products from different categories, and merchants, add products from multiple merchants to the cart, complete the payment online, and many more.",
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
