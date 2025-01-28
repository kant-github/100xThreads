import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import Image from "next/image";
import { WelcomeChannel } from "types";
import { Barriecito } from "next/font/google";
import MagneticWrapper from "@/components/ui/MagneticWrapper";

const font = Barriecito({ weight: "400", subsets: ["latin"] })

interface WelcomeChannelViewProps {
    channel: WelcomeChannel;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.welcome_message!}>{"Welcome"}</DashboardComponentHeading>
            <UtilityCard className=" w-full flex-grow mt-4">
                <div className="relative">
                    <Image
                        height={20}
                        width={1400}
                        alt="sdf"
                        src={"/images/welcomeChannelDashboardImage.jpeg"}
                        className="rounded-[16px]"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-[16px]"></div>
                        <div className={`text-6xl w-full mx-auto flex justify-center font-black tracking-widest leading-[24px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 z-20 ${font.className}`}>
                            WELCOME CHANNEL
                        </div>
                </div>
            </UtilityCard>
        </div>
    );
}