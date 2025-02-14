"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import UnclickableTicker from "./UnclickableTicker";

export default function () {
    return (
        <div className="flex flex-col overflow-hidden bg-gradient-conic from-cyan-500 via-transparent to-transparent">
            <ContainerScroll
                titleComponent={
                    <>
                        <div className="mb-12 flex flex-col">
                            <span className="text-4xl md:text-[3.5rem] font-bold mt-1 leading-none bg-gradient-to-b from-[#f5a331] via-amber-500 to-neutral-900 text-transparent bg-clip-text">
                                Chats, Projects & Events, that's all
                            </span>
                            <p className="text-center text-xl font-extralight text-neutral-400 tracking-wider mt-4 leading-tight">
                                Experience seamless, real-time communication with our lightning-fast, Redis-powered chat app, designed to scale effortlessly as your connections grow
                            </p>
                        </div>
                    </>
                }
            >
                <Image
                    src={`/images/dashboard.png`}
                    alt="hero"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>
        </div>
    );
}
