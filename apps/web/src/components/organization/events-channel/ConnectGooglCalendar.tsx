import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import ToolTipComponent from "@/components/ui/ToolTipComponent";
import UnclickableTicker from "@/components/ui/UnclickableTicker";
import UtilityCard from "@/components/utility/UtilityCard";
import handleGoogleCalendarConnect from "@/lib/handleGoogleCalendarConnect";
import isExpiredtoken from "@/lib/isExpiredToken";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { ChevronLeft, Dot } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { EventChannelType } from "types/types";

interface EventNotConnectedComponentProps {
    channel: EventChannelType;
    setShowGoogleCalendarPage?: Dispatch<SetStateAction<boolean>>;
}

export default function EventNotConnectedComponent({ channel, setShowGoogleCalendarPage }: EventNotConnectedComponentProps) {
    const organizationUser = useRecoilValue(organizationUserAtom);
    const [googleCalendarConnectionDialog, setGoogleCalendarConnectionDialog] = useState<boolean>(false);
    function handleConnect() {
        handleGoogleCalendarConnect(window.location.href);
    }

    useEffect(() => {
        const shouldShowDialog = !organizationUser?.user?.token_expires_at || isExpiredtoken(organizationUser?.user?.token_expires_at);

        if (shouldShowDialog) {
            setGoogleCalendarConnectionDialog(true);
        }
    }, [organizationUser?.user?.token_expires_at]);

    return (
        <UtilityCard className="flex flex-col gap-y-4 px-6">
            <span>
                {
                    channel.google_calendar_id && (
                        <Button onClick={() => {
                            if (setShowGoogleCalendarPage) {
                                setShowGoogleCalendarPage(false)
                            }
                        }} variant={'ghost'} className="rounded-full aspect-square flex items-center justify-center gap-x-2 hover:bg-terDark">
                            <ChevronLeft className="text-neutral-200" />
                            <span className="text-sm text-neutral-200">Back</span>
                        </Button>
                    )
                }
            </span>
            <DashboardComponentHeading description="Link Google Calendar to manage events with the Event Channel on ShelvR.">
                Google Calendar
            </DashboardComponentHeading>

            <div className="grid grid-cols-[1.3fr_1fr] w-full mt-2">
                <UtilityCard className="rounded-[8px] bg-terDark flex flex-col items-center justify-center gap-y-8 p-8">
                    <Image
                        src={"/images/google-calendar-demo.png"}
                        width={600}
                        height={400}
                        unoptimized
                        alt="Google Calendar demo screenshot"
                        className="rounded-[8px]"
                    />
                </UtilityCard>
                <div className="flex-1 flex flex-col gap-y-4 pl-8">
                    <div className="flex items-center justify-start gap-x-4">
                        <Image
                            src="/images/google-calendar.png"
                            height={60}
                            width={60}
                            unoptimized
                            alt="Google Calendar logo"
                            className="object-contain"
                        />
                        <span className="text-2xl font-bold text-neutral-100">Google Calendar</span>
                    </div>
                    <div className="flex items-center justify-start">
                        <UnclickableTicker className="rounded-[8px] border-none">Event Integration</UnclickableTicker>
                        <Dot className="text-neutral-100" />
                        <span className="text-sm text-neutral-100 font-light">Published by ShelvR</span>
                    </div>
                    <hr className="border-neutral-700" />
                    <div className="flex items-center justify-between w-full">

                        {!googleCalendarConnectionDialog ? (
                            <Button variant={"ghost"} className="border-[1px] border-red-600 text-red-600 hover:bg-terDark text-xs rounded-[8px] py-0.5">
                                Disconnect
                            </Button>
                        ) : (
                            <Button onClick={handleConnect} variant={"ghost"} className="border-[1px] border-neutral-700 text-neutral-100 text-xs rounded-[8px] py-0.5">
                                Connect Calendar
                            </Button>
                        )}
                        <ToolTipComponent content={
                            <span>
                                Link your Google Calendar to ShelvR to create, sync, and manage events from one centralized place.
                            </span>
                        }>
                            <IoIosInformationCircleOutline
                                size={25}
                                className="hover:text-primary/70 p-[3px] rounded-[4px] text-primary transition-colors ease-in"
                            />
                        </ToolTipComponent>
                    </div>

                    <div className="flex items-center justify-start text-neutral-300 text-[13px] font-light tracking-wider">
                        Google Calendar is a scheduling and time management service developed by Google. By connecting it to ShelvR, you can effortlessly manage your events, avoid scheduling conflicts, and ensure your workflows stay in sync across devices. Ideal for individuals and teams using the Event Channel feature.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
                <UtilityCard className="bg-gradient-to-r from-neutral-950 via-[#161616] to-neutral-950 shadow-md p-4 flex flex-col items-center justify-center w-68 h-48 rounded-[8px] space-y-2 border-[1px] border-secDark hover:scale-105 transition-all ease-in">
                    <Image src="/images/event-image-2.svg" width={100} height={100} alt="Event preview" unoptimized className="invert" />
                    <span className="text-xs text-neutral-400 tracking-wide">Seamless scheduling</span>
                </UtilityCard>

                <UtilityCard className="bg-gradient-to-r from-neutral-950 via-[#161616] to-neutral-950 shadow-md p-4 flex flex-col items-center justify-center w-68 h-48 rounded-[8px] space-y-2 border-[1px] border-secDark hover:scale-105 transition-all ease-in">
                    <Image src="/images/event-image-3.svg" width={100} height={100} alt="Event preview" unoptimized className="invert" />
                    <span className="text-xs text-neutral-400 tracking-wide">Smart event tracking</span>
                </UtilityCard>

                <UtilityCard className="bg-gradient-to-r from-neutral-950 via-[#161616] to-neutral-950 shadow-md p-4 flex flex-col items-center justify-center w-68 h-48 rounded-[8px] space-y-2 border-[1px] border-secDark hover:scale-105 transition-all ease-in">
                    <Image src="/images/event-image-4.svg" width={100} height={100} alt="Event preview" unoptimized className="invert" />
                    <span className="text-xs text-neutral-400 tracking-wide">Integrated reminders</span>
                </UtilityCard>

                <UtilityCard className="bg-gradient-to-r from-neutral-950 via-[#161616] to-neutral-950 shadow-md p-4 flex flex-col items-center justify-center w-68 h-48 rounded-[8px] space-y-2 border-[1px] border-secDark hover:scale-105 transition-all ease-in">
                    <Image src="/images/event-image-5.svg" width={100} height={100} alt="Event preview" unoptimized className="invert" />
                    <span className="text-xs text-neutral-400 tracking-wide">Stay in sync</span>
                </UtilityCard>
            </div>
        </UtilityCard>
    );
}
