import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import Image from "next/image";
import { WelcomeChannel } from "types/types";
import WelcomeChannelMessages from "../welcome-channel/WelcomeChannelMessages";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom, organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useEffect } from "react";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { welcomeChannelMessagesAtom } from "@/recoil/atoms/organizationAtoms/welcomeChannelMessagesAtom";
import { useWebSocket } from "@/hooks/useWebsocket";
import { Barriecito } from "next/font/google";

const font = Barriecito({ weight: "400", subsets: ["latin"] })

interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    console.log("channel currently is : ", channel);
    const organization = useRecoilValue(organizationAtom);
    const session = useRecoilValue(userSessionAtom);
    const setWelcomeChannelMessages = useSetRecoilState(welcomeChannelMessagesAtom);
    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();

    useEffect(() => {
        if (organization?.id && channel.id) {
            subscribeToBackend(channel.id, organization.id, 'welcome-user');
            const unsubscribeWelcomeMessageHandler = subscribeToHandler('welcome-user', handleIncomingWelcomeMessages);
            return () => {
                unsubscribeWelcomeMessageHandler();
                unsubscribeFromBackend(channel.id, organization.id, 'welcome-user');
            }
        }
    }, [channel.id, organization?.id]);

    function handleIncomingWelcomeMessages(newMessage: any) {
        console.log("message incoming");
        setWelcomeChannelMessages(prev => [...prev, newMessage]);
    }

    async function getWelcomeMessages() {
        try {
            const data = await axios.get(`${API_URL}/organizations/${organization?.id}/channels/${channel.id}/welcome-channel`, {
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
    }, [organization?.id])

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.welcome_message!}>{`${organization?.name}'s welcome channel`}</DashboardComponentHeading>
            <UtilityCard className="w-full flex-grow mt-4 flex flex-col h-full">
                <div className="relative rounded-[16px] h-[30%] w-full">
                    <Image
                        height={20}
                        width={1400}
                        alt="help desk banner"
                        src={"/images/welcomeChannelDashboardImage.jpeg"}
                        className="rounded-[16px] object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-[16px]"></div>
                    <div className={`text-5xl w-full mx-auto flex justify-center font-black tracking-widest leading-[24px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 z-20 select-none ${font.className}`}>
                        WELCOME CHANNEL
                    </div>
                </div>
                <WelcomeChannelMessages className="flex-1" />
            </UtilityCard>
        </div>
    );
}