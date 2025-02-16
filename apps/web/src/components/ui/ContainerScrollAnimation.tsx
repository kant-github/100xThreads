"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import { GiJigsawPiece } from "react-icons/gi";
import { TextHoverEffect } from "./text-hover-effect";
import UnclickableTicker from "./UnclickableTicker";
import { MdChatBubble } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";



export default function () {
    return (
        <div className="flex flex-col overflow-hidden bg-gradient-conic from-cyan-500 via-transparent to-transparent">
            <ContainerScroll
                titleComponent={
                    <>
                        <div className="mb-12 flex flex-col items-center relative ">
                            <UnclickableTicker className="-rotate-12 absolute -top-16 left-0 text-sm"> <IoCalendar className="text-blue-600" />events</UnclickableTicker>
                            <UnclickableTicker className="rotate-12 absolute -top-20 right-0 text-sm"><MdChatBubble className="text-green-500" />chats</UnclickableTicker>
                            <span className="bg-neutral-500 px-8 py-1.5 absolute -top-16 rounded-full border border-neutral-500 bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-800">
                                <span className="text-neutral-300 font-black tracking-wider flex items-center text-2xl gap-x-2">
                                    <GiJigsawPiece className="text-amber-500" size={28} />
                                    <div>
                                        Shelv<span className="text-red-500">R</span>
                                    </div>
                                </span>
                            </span>
                            <span className="text-4xl md:text-[3.5rem] font-bold mt-1 leading-none bg-gradient-to-b from-amber-300 via-amber-500 to-neutral-900 text-transparent bg-clip-text">
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
            <div className="w-[30%]">
                <TextHoverEffect text="ShelvR" />
            </div>

        </div>
    );
}
