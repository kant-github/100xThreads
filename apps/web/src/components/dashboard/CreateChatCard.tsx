"use client";
import Image from "next/image";
import { ImHome } from "react-icons/im";
import BigWhiteBtn from "../buttons/BigWhiteBtn";
import React, { useState } from "react";
import CreateRoom from "./CreateRoom";
import axios from "axios";
import { toast } from "sonner";
import moment from 'moment';
import { createChatSchema } from "@/validations/createChatZod";
import { clearCache } from "actions/common";
import { CHAT_GROUP } from "@/lib/apiAuthRoutes";
import { CgMathPlus } from "react-icons/cg";
import { CustomSession } from "app/api/auth/[...nextauth]/options";


export default function CreateRoomComponent({ session }: { session: CustomSession | null }) {
    const [createRoomModal, setCreateRoomModal] = useState<boolean>(false);
    const [organizationName, setOrganizationName] = useState<string>("");
    const [roomPasscode, setRoomPasscode] = useState<string>("");
    const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
    const [icon, setIcon] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(session?.user?.name!);

    async function createChatHandler() {
        const payload = { title: organizationName, passcode: roomPasscode };
        const result = createChatSchema.safeParse(payload);

        if (!result.success) {
            const errorMessages = result.error.errors.map(err => err.message).join(", ");
            toast.error(`Error: ${errorMessages}`);
            return;
        }

        const finalPayload = new FormData();
        finalPayload.append('title', result.data.title);
        finalPayload.append('passcode', result.data.passcode);
        if (groupPhoto) {
            finalPayload.append('groupPhoto', groupPhoto);
        }
        if (icon) {
            finalPayload.append("icon", icon);
        }



        try {
            const { data } = await axios.post(`${CHAT_GROUP}`, finalPayload, {
                headers: {
                    authorization: `Bearer ${session?.user?.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const formattedDate = moment().format('dddd, MMMM D, YYYY');
            toast.message(data.message, {
                description: formattedDate
            });

            setOrganizationName("");
            setRoomPasscode("");
            setIcon("");
            clearCache("dashboard");
            setCreateRoomModal(false);
        } catch (err) {
            console.log(err);
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
                createChatHandler={createChatHandler}
                name={name}
                setName={setName}
                organizationName={organizationName}
                setOrganizationName={setOrganizationName}
                roomPasscode={roomPasscode}
                setRoomPasscode={setRoomPasscode}
                open={createRoomModal}
                setOpen={setCreateRoomModal}
                groupPhoto={groupPhoto}
                setGroupPhoto={setGroupPhoto}
                setIcon={setIcon}
                icon={icon}
            />
        </>
    );
}
