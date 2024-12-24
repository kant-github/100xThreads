"use client";
import Image from "next/image";
import { ImHome } from "react-icons/im";
import BigWhiteBtn from "../buttons/BigWhiteBtn";
import React, { useState } from "react";
import CreateRoom from "./CreateRoom";
import axios from "axios";
import { toast } from "sonner";
import moment from 'moment';
import { createRoomSchema } from "@/validations/createChatZod";
import { clearCache } from "actions/common";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { CgMathPlus } from "react-icons/cg";
import { CustomSession } from "app/api/auth/[...nextauth]/options";
import { useRecoilState } from "recoil";
import { organizationsAtom } from "@/recoil/atoms/organizationsAtom";
import { Belanosima } from 'next/font/google';
import { FaIndustry } from "react-icons/fa6";
import CreateOrganizationButton from "../buttons/CreateOrganizationButton";
import { WobbleCard } from "../ui/wobble-card";
import WobbleCardComponent from "./WobbleCardComponent";

const doto = Belanosima({
    subsets: ['latin'],
    weight: ['700'],
});
export enum OrganizationType {
    Startup = "Startup",
    NonProfit = "Non-Profit",
    Educational = "Educational",
    Government = "Government",
    Corporate = "Corporate",
    Community = "Community",
    Other = "Other"
}


export default function ({ session }: { session: CustomSession | null }) {
    const [createRoomModal, setCreateRoomModal] = useState<boolean>(false);
    const [organizationName, setOrganizationName] = useState<string | null>(null);
    const [roomPasscode, setRoomPasscode] = useState<string>("");
    const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
    const [icon, setIcon] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(session?.user?.name!);
    const [organizationType, setOrganizationType] = useState<OrganizationType>(OrganizationType.Community);
    const [termsAndconditionChecked, setTermsAndConditionchecked] = useState<boolean>(false);
    const [selectedGroups, setSelectedGroups] = useState({
        generalChat: true,
        adminPage: true,
        projectsChannel: true,
        events: true,
        announcements: true,
    });
    const [organizations, setOrganizations] = useRecoilState(organizationsAtom);
    async function creaOrganizationHandler() {

        const selectedGroupNames = Object.entries(selectedGroups).filter(([key, value]) => value === true).map(([key]) => key);

        const payload = {
            name: organizationName,
            passcode: roomPasscode,
            icon: icon,
            type: organizationType,
            termsAndCond: termsAndconditionChecked,
            selectedGroups: selectedGroupNames,
        };
        const result = createRoomSchema.safeParse(payload);
        console.log("result is:", result);

        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message).join(", ");
            toast.error(`Error: ${errorMessages}`);
            return;
        }

        const finalPayload = new FormData();
        finalPayload.append("name", result.data.name);

        if (result.data.icon) {
            finalPayload.append("icon", result.data.icon);
        }

        finalPayload.append("type", result.data.type);
        finalPayload.append("termsAndCond", String(result.data.termsAndCond));
        finalPayload.append("selectedGroups", JSON.stringify(result.data.selectedGroups));

        try {
            const { data } = await axios.post(`${ORGANIZATION}`, finalPayload, {
                headers: {
                    authorization: `Bearer ${session?.user?.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("new created data : ", data.data);
            setOrganizations([data.data, ...organizations]);

            const formattedDate = moment().format("dddd, MMMM D, YYYY");
            toast.message(data.message, {
                description: formattedDate,
            });
            setOrganizationName(null);
            setOrganizationType(OrganizationType.Community);
            setIcon(null);
            clearCache("dashboard");
            setCreateRoomModal(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create chat room. Please try again.");
        }
    }


    function openModal() {
        setCreateRoomModal(true);
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
                        <CreateOrganizationButton onClick={openModal}>
                            <CgMathPlus className="group-hover:rotate-90 group-hover:-translate-x-3 transition-transform duration-300 ease-in-out" size={16} />
                            Create Organization
                        </CreateOrganizationButton>
                    </div>
                </div>
            </div>
            <WobbleCardComponent/>
            <CreateRoom
                session={session}
                creaOrganizationHandler={creaOrganizationHandler}
                name={name}
                setName={setName}
                organizationName={organizationName}
                setOrganizationName={setOrganizationName}
                organizationType={organizationType}
                setOrganizationType={setOrganizationType}
                selectedGroups={selectedGroups}
                setSelectedGroups={setSelectedGroups}
                roomPasscode={roomPasscode}
                setRoomPasscode={setRoomPasscode}
                open={createRoomModal}
                setOpen={setCreateRoomModal}
                groupPhoto={groupPhoto}
                setGroupPhoto={setGroupPhoto}
                setIcon={setIcon}
                icon={icon}
                termsAndconditionChecked={termsAndconditionChecked}
                setTermsAndConditionchecked={setTermsAndConditionchecked}
            />
        </div>
    );
}
