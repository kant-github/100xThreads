"use client";

import { useEffect, useRef } from 'react';
import Image from "next/image";
import Heading from "../heading/Heading";
import ButtonGroup from "../client/ButtonGroup";
import FeatureSection from "./FeatureSection";
import { gsap } from 'gsap';


export default function HeroSection() {
    const headingRef = useRef(null);
    const paragraphRef = useRef(null);
    const buttonGroupRef = useRef(null);
    const imageRef = useRef(null);
    const featureSectionRef = useRef(null);

    useEffect(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

        timeline
            .fromTo(
                headingRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8 }
            )
            .fromTo(
                paragraphRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.4'
            )
            .fromTo(
                buttonGroupRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.4'
            )
            .fromTo(
                imageRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.8 },
                '-=0.4'
            )
            .fromTo(
                featureSectionRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.4'
            );
    }, []);

    return (
        <div className="bg-[#F1F1F1] dark:bg-[#131212] dark:text-gray-400 w-full h-full">
            <div className="flex flex-col items-center justify-center">
                <div ref={headingRef} className="mt-12">
                    <Heading>Everything app for your teams</Heading>
                </div>
                <div ref={paragraphRef} className="w-1/2 mt-8">
                    <p className="text-center font-extralight">
                        Experience seamless, real-time communication with our lightning-fast, Redis-powered chat app, designed to scale effortlessly as your connections grow
                    </p>
                </div>
                <div ref={buttonGroupRef} className="mt-8">
                    <ButtonGroup />
                </div>
                <div ref={imageRef}>
                    <Image
                        className="transform transition-transform duration-300 hover:scale-105"
                        src={"/images/conversation.svg"}
                        width={600}
                        height={600}
                        alt="hero"
                    />
                </div>
                <div ref={featureSectionRef}>
                    <FeatureSection />
                </div>
            </div>
        </div>
    );
}