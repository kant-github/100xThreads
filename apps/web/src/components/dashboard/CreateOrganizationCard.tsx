"use client";
import React from "react";
import CreateRoomForm from "./CreateOrganizationForm";
import { CgMathPlus } from "react-icons/cg";
import { useRecoilState } from "recoil";
import { Belanosima } from 'next/font/google';
import { FaIndustry } from "react-icons/fa6";
import CreateOrganizationButton from "../buttons/CreateOrganizationButton";
import WobbleCardComponent from "./WobbleCardComponent";
import { createOrganizationAtom } from "@/recoil/atoms/atom";

const doto = Belanosima({
    subsets: ['latin'],
    weight: ['700'],
});

export default function () {
    const [open, setOpen] = useRecoilState(createOrganizationAtom)

    function openModal() {
        setOpen(true);
    }

    return (
        <div className="w-full  flex flex-row justify-center items-center gap-x-12 px-12">
            <div className="md:w-4/6 w-screen transform dark:bg-[#f5a331] bg-[#202a2e] px-12 py-4 rounded-[8px] mx-4 my-12">
                <div className="flex flex-col">
                    <div>
                        <div className="flex flex-row items-center ml-0.5 gap-x-2">
                            <FaIndustry size={26} className="dark:text-gray-800 text-gray-200 text-20" />
                            <h3 className={`${doto.className} dark:text-gray-800 pt-1 text-gray-200 text-2xl font-bold tracking-wider`}>CREATE ORGANIZATION</h3>
                        </div>
                        <p className="text-gray-200 dark:text-gray-800 font-semibold italic tracking-wider md:text-[13px] text-xs mt-3">
                            Start a chat room with just a few clicks and stay connected with friends. Chat, share, and catch up anytime!
                        </p>
                    </div>
                    <div className="w-full flex flex-row justify-center mt-8 mb-3 group">
                        <CreateOrganizationButton className="shadow-lg shadow-yellow-900" onClick={openModal}>
                            <CgMathPlus className="group-hover:rotate-90 group-hover:-translate-x-3 transition-transform duration-300 ease-in-out" size={16} />
                            Create Organization
                        </CreateOrganizationButton>
                    </div>
                </div>
            </div>
            <WobbleCardComponent />
            <CreateRoomForm open={open} setOpen={setOpen} />
        </div>
    );
}
