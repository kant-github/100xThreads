"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "Mentorship by Harkirat Singh",
    description:
      "100xDevs is an initiative by Harkirat Singh to personally mentor individuals in the field of programming. The goal is to transform learners into 100x engineers through hands-on projects and real-world applications.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="https://www.instagram.com/p/DI8N8yATVPI/media/?size=l"
          alt="Harkirat Singh mentoring"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ),
  },
  {
    title: "Comprehensive Cohort Programs",
    description:
      "100xDevs offers structured cohort programs covering Web Development, DevOps, and Blockchain. These programs are designed to provide a complete learning journey from basics to advanced topics.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/images/100xSport-logo.webp"
          alt="Cohort program overview"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ),
  },
  {
    title: "Hands-on Projects and Assignments",
    description:
      "Learners engage in practical assignments and projects, such as building a Second Brain App, to apply their knowledge and gain real-world experience.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/images/100xEvent-logo.webp"
          alt="Project screenshot"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ),
  },
  {
    title: "Community and Networking",
    description:
      "Join a vibrant community of learners and professionals. Participate in discussions, share knowledge, and grow together in a supportive environment.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/images/100xSuperlabs-logo.webp"
          alt="Community event"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="mt-4">
      <StickyScroll content={content} />
    </div>
  );
}
