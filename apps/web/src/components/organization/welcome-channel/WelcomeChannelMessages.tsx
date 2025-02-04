import UtilityCard from "@/components/utility/UtilityCard";
import { welcomeChannelMessagesAtom } from "@/recoil/atoms/organizationAtoms/welcomeChannelMessagesAtom";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { FaHandPointRight } from "react-icons/fa";
import { parseISO, formatDistanceToNow } from "date-fns";
import GreyButton from "@/components/buttons/GreyButton";

interface WelcomeChannelMessagesProps {
    className?: string;
}

export default function WelcomeChannelMessages({ className }: WelcomeChannelMessagesProps) {
    const welcomeChannelMessages = useRecoilValue(welcomeChannelMessagesAtom);
    return (
        <UtilityCard className={`mt-4 overflow-hidden bg-white dark:bg-neutral-800 w-full ${className}`}>
            <div className="flex flex-col overflow-y-auto max-h-[22rem] scrollbar-hide">
                {welcomeChannelMessages.map((message) => {
                    const welcomedAtDate = typeof message.welcomed_at === "string" ? parseISO(message.welcomed_at) : message.welcomed_at;
                    return (
                        <div key={message.id} className="flex items-start gap-x-4 w-full bg-neutral-900/20 px-6 py-4 transition-colors border-b-[0.5px] border-neutral-700">
                            <FaHandPointRight size={12} className="text-yellow-500/90 mt-2.5" />
                            <div className="flex flex-col gap-y-2 flex-grow">
                                <div className="flex items-center flex-row gap-x-1 text-sm font-semibold">
                                    {message.user.name}
                                    <div className="font-normal">
                                        joined {formatDistanceToNow(welcomedAtDate, { addSuffix: true })}
                                    </div>
                                    <GreyButton className="ml-8">Ask for Role</GreyButton>
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
                })}
            </div>
        </UtilityCard>
    );
}
