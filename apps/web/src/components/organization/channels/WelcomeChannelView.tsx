import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import Image from "next/image";
import { WelcomeChannel } from "types";
import { Barriecito } from "next/font/google";
import WelcomeChannelMessages from "../welcome-channel/WelcomeChannelMessages";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useEffect } from "react";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { welcomeChannelMessagesAtom } from "@/recoil/atoms/organizationAtoms/welcomeChannelMessagesAtom";

const font = Barriecito({ weight: "400", subsets: ["latin"] })

interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    const organizationId = useRecoilValue(organizationIdAtom);
    const session = useRecoilValue(userSessionAtom);
    const setWelcomeChannelMessages = useSetRecoilState(welcomeChannelMessagesAtom);

    async function getWelcomeMessages() {
        try {
            const data = await axios.get(`${API_URL}/organizations/${organizationId}/channels/${channel.id}/welcome-channel`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                }
            })
            if (data.data.data) {
                setWelcomeChannelMessages(data.data.data)
            }
        } catch (err) {
            console.log("Error in fetching the welcome channel messages");
        }

    }

    useEffect(() => {
        getWelcomeMessages();
    }, [])

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.welcome_message!}>{"Welcome"}</DashboardComponentHeading>
            <UtilityCard className="w-full flex-grow mt-4 flex flex-col h-full">
                <div className="relative rounded-[16px]">
                    <Image
                        height={20}
                        width={1400}
                        alt="sdf"
                        src={"/images/welcomeChannelDashboardImage.jpeg"}
                        className="rounded-[16px]"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-[16px]"></div>
                    <div className={`text-6xl w-full mx-auto flex justify-center font-black tracking-widest leading-[24px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 z-20 select-none ${font.className}`}>
                        WELCOME CHANNEL
                    </div>
                </div>
                <WelcomeChannelMessages className="flex-grow" />
            </UtilityCard>
        </div>
    );
}