import UtilityCard from "@/components/utility/UtilityCard";
import { welcomeChannelMessagesAtom } from "@/recoil/atoms/organizationAtoms/welcomeChannelMessagesAtom";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { FaHandPointRight } from "react-icons/fa";
import { parseISO, formatDistanceToNow } from "date-fns";
import GreyButton from "@/components/buttons/GreyButton";
import { useState } from "react";
import WelcomeChannelRoleOptionMenu from "./WelcomeChannelRoleOptionMenu";
import WelcomeChannelData from "./WelcomeChannelData";

interface WelcomeChannelMessagesProps {
    className?: string;
}

export default function WelcomeChannelMessages({ className }: WelcomeChannelMessagesProps) {
    const welcomeChannelMessages = useRecoilValue(welcomeChannelMessagesAtom);

    return (
        <UtilityCard className={`mt-4 overflow-hidden bg-white dark:bg-neutral-800 w-full shadow-lg shadow-black/20 ${className}`}>
            <div className="flex flex-col overflow-y-auto max-h-[22rem] scrollbar-hide">

                {
                    welcomeChannelMessages.map((message) => <WelcomeChannelData message={message} />)
                }

            </div>
        </UtilityCard>
    );
}
