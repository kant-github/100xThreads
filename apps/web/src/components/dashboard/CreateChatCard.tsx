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
import { CHAT_GROUP, ORGANIZATION } from "@/lib/apiAuthRoutes";
import { CgMathPlus } from "react-icons/cg";
import { CustomSession } from "app/api/auth/[...nextauth]/options";

export enum OrganizationType {
    Startup = "Startup",
    NonProfit = "Non-Profit",
    Educational = "Educational",
    Government = "Government",
    Corporate = "Corporate",
    Community = "Community",
    Other = "Other"
}


export default function CreateRoomComponent({ session }: { session: CustomSession | null }) {
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

    async function createChatHandler() {

        const selectedGroupNames = Object.entries(selectedGroups).filter(([key, value]) => value === true).map(([key]) => key);

        const payload = {
            name: organizationName,
            passcode: roomPasscode,
            icon: icon,
            type: organizationType,
            termsAndCond: termsAndconditionChecked,
            selectedGroups: selectedGroupNames,  // Send only the selected group names
        };

        console.log("payload is : ", payload);

        console.log("payload is:", payload);

        // Validate payload with Zod
        const result = createRoomSchema.safeParse(payload);
        console.log("result is:", result);

        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message).join(", ");
            toast.error(`Error: ${errorMessages}`);
            return;
        }

        // Create FormData
        const finalPayload = new FormData();
        finalPayload.append("name", result.data.name);

        if (result.data.icon) {
            finalPayload.append("icon", result.data.icon);
        }

        finalPayload.append("type", result.data.type);
        finalPayload.append("termsAndCond", String(result.data.termsAndCond));

        // Send only the selected group names as a JSON string
        finalPayload.append("selectedGroups", JSON.stringify(result.data.selectedGroups));

        try {
            const { data } = await axios.post(`${ORGANIZATION}`, finalPayload, {
                headers: {
                    authorization: `Bearer ${session?.user?.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

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
        <>
            <div className="md:w-2/5 w-screen transform dark:bg-[#f5a331] bg-[#202a2e] px-12 py-4 rounded-[8px] mx-4 my-12">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-x-8 items-center mt-4 justify-between">
                        <div>
                            <div className="flex flex-row items-center ml-0.5 gap-x-2">
                                <ImHome size={18} className="dark:text-gray-800 text-gray-200" />
                                <h3 className="dark:text-gray-800 pt-1 text-gray-200 font-bold">Create a Room</h3>
                            </div>
                            <p className="text-gray-200 dark:text-gray-800 font-normal tracking-wider md:text-xs text-[8px] mt-3">
                                Start a chat room with just a few clicks and stay connected with friends. Chat, share, and catch up anytime!
                            </p>
                        </div>
                        <Image src="/images/talking.png" width={80} height={80} alt="talking" />
                    </div>
                    <div className="w-3/5 flex flex-row justify-center mt-8 mb-3 group">
                        <BigWhiteBtn onClick={openModal}>
                            <CgMathPlus className="group-hover:rotate-90 group-hover:-translate-x-3 transition-transform duration-300 ease-in-out" size={16} />
                            Create Organization
                        </BigWhiteBtn>
                    </div>
                </div>
            </div>
            <CreateRoom
                session={session}
                createChatHandler={createChatHandler}
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
        </>
    );
}
