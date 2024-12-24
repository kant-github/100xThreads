"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export default function () {
    return (
        <div className="w-full">
            <div className="grid grid-cols-9 gap-8 max-w-7xl mx-auto w-full px-8 mt-12">
                

                <WobbleCard containerClassName="col-span-3 h-[300px]">
                    <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                        No shirt, no shoes, no weapons.
                    </h2>
                    <p className="mt-4 max-w-[20rem] text-left text-base/6 text-neutral-200">
                        If someone yells “stop!”, goes limp, or taps out, the fight is over.
                    </p>
                </WobbleCard>
            </div>
        </div>
    );
}
