import GreyButton from "@/components/buttons/GreyButton";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useState } from "react";
import { FaHandPointRight } from "react-icons/fa";
import { WelcomedUserTypes } from "types/types";
import WelcomeChannelRoleOptionMenu from "./WelcomeChannelRoleOptionMenu";
import Image from "next/image";

interface WelcomeChannelDataProps {
    message: WelcomedUserTypes;
}

export default function ({ message }: WelcomeChannelDataProps) {
    const welcomedAtDate = typeof message.welcomed_at === "string" ? parseISO(message.welcomed_at) : message.welcomed_at;
    const [askForRoleOptionMenu, setAskForRoleOptionMenu] = useState<boolean>(false);

    function askForRoleHandler() {
        setAskForRoleOptionMenu(prev => !prev);
    }
    return (

        <div key={message.id} className="flex items-start gap-x-4 w-full bg-neutral-900/20 px-6 py-4 transition-colors border-b-[0.5px] border-neutral-700">
            <FaHandPointRight size={12} className="text-yellow-500/90 mt-2.5" />
            <div className="flex flex-col gap-y-2 flex-grow">
                <div className="flex items-center flex-row gap-x-1 text-sm font-semibold relative">
                    {message.user.name}
                    <div className="font-normal">
                        joined {formatDistanceToNow(welcomedAtDate, { addSuffix: true })}
                    </div>
                    <GreyButton onClick={askForRoleHandler} className="ml-8">Ask for Role</GreyButton>
                    <WelcomeChannelRoleOptionMenu open={askForRoleOptionMenu} setOpen={setAskForRoleOptionMenu} />
                </div>
                <div className="text-[13px] text-neutral-600 dark:text-neutral-300 font-light italic text-balance">
                    <span>{message.message}</span>
                </div>
            </div>
            <div className="flex-shrink-0">
                <Image src={message.user.image} width={40} height={40} alt={`${message.user.name}'s avatar`} className="rounded-[8px] object-cover" />
            </div>
        </div>

    );
}