import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import ToolTipComponent from "@/components/ui/ToolTipComponent";
import UnclickableTicker from "@/components/ui/UnclickableTicker";
import UtilityCard from "@/components/utility/UtilityCard";
import handleGoogleCalendarConnect from "@/lib/handleGoogleCalendarConnect";
import isExpiredtoken from "@/lib/isExpiredToken";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { ChevronLeft, Dot, User, Shield, Calendar, Zap, Link } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { EventChannelType } from "types/types";

interface EventNotConnectedComponentProps {
    channel: EventChannelType;
    setShowGoogleCalendarPage?: Dispatch<SetStateAction<boolean>>;
}

export default function ConnectUserToGooglCalendar({ channel, setShowGoogleCalendarPage }: EventNotConnectedComponentProps) {
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
        <div className="overflow-hidden relative h-full">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-neutral-500/10 rounded-full blur-md animate-pulse delay-500"></div>
            </div>

            {/* Main Google Calendar integration visual */}
            <div className="absolute -bottom-[12%] -right-0 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent rounded-[16px] blur-sm"></div>

                    {/* Step indicator */}
                    <div className="absolute -top-12 left-4 flex items-center gap-x-4 z-10">
                        <div className="group relative">
                            <div className="relative flex items-center gap-x-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-3 py-2 rounded-[8px] border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-xs font-bold text-white">1</span>
                                </div>
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Connect Account</span>
                            </div>
                        </div>

                        <div className="group relative opacity-50">
                            <div className="relative flex items-center gap-x-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-3 py-2 rounded-[8px] border border-white/30 shadow-lg">
                                <div className="w-6 h-6 bg-neutral-400 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-xs font-bold text-white">2</span>
                                </div>
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Setup Channel</span>
                            </div>
                        </div>
                    </div>

                    {/* Main container */}
                    <div className="relative rounded-[16px] p-[6px] border-[1px] border-dashed border-neutral-300/40 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm shadow-2xl">
                        <div className="relative overflow-hidden rounded-[10px] border-[1px] border-neutral-700">
                            <Image
                                src={"/images/google-calendar-demo.png"}
                                width={600}
                                height={400}
                                unoptimized
                                alt="Google Calendar demo screenshot"
                                className="rounded-[10px] opacity-80 hover:opacity-100 transition-opacity duration-300"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="space-y-6">
                    {/* Back button */}
                    {channel.google_calendar_id && (
                        <Button
                            onClick={() => {
                                if (setShowGoogleCalendarPage) {
                                    setShowGoogleCalendarPage(false)
                                }
                            }}
                            variant={'ghost'}
                            className="rounded-full w-fit flex items-center justify-center gap-x-2 hover:bg-terDark mb-4"
                        >
                            <ChevronLeft className="text-neutral-200" />
                            <span className="text-sm text-neutral-200">Back</span>
                        </Button>
                    )}

                    <DashboardComponentHeading
                        description="Connect your Google account to ShelvR to enable calendar integration and manage events seamlessly."
                    >
                        Connect to Google Calendar
                    </DashboardComponentHeading>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-full">
                        <UtilityCard className="group relative flex items-center gap-x-3 border-[1px] border-neutral-700 px-6 py-5">
                            <div className="bg-amber-500 p-1.5 rounded-[4px]">
                                <User className="text-white w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Account Link</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Secure Google connection</p>
                            </div>
                        </UtilityCard>

                        <UtilityCard className="group relative flex items-center gap-x-3 border-[1px] border-neutral-700 px-6 py-5">
                            <div className="bg-amber-500 p-1.5 rounded-[4px]">
                                <Shield className="text-white w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Secure Access</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">OAuth 2.0 authentication</p>
                            </div>
                        </UtilityCard>

                        <UtilityCard className="group relative flex items-center gap-x-3 border-[1px] border-neutral-700 px-6 py-5">
                            <div className="bg-amber-500 p-1.5 rounded-[4px]">
                                <Zap className="text-white w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Instant Sync</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Real-time event updates</p>
                            </div>
                        </UtilityCard>
                    </div>

                    {/* Google Calendar info section */}
                    <div className="flex items-center justify-start gap-x-4 max-w-2xl">
                        <Image
                            src="/images/google-calendar.png"
                            height={60}
                            width={60}
                            unoptimized
                            alt="Google Calendar logo"
                            className="object-contain"
                        />
                        <div className="space-y-2">
                            <span className="text-2xl font-bold text-neutral-100">Google Calendar</span>
                            <div className="flex items-center justify-start">
                                <UnclickableTicker className="rounded-[8px] border-none">Event Integration</UnclickableTicker>
                                <Dot className="text-neutral-100" />
                                <span className="text-sm text-neutral-100 font-light">Published by ShelvR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to action area */}
                <div className="flex w-full items-center justify-between bg-neutral-800/80 backdrop-blur-sm px-6 py-3 rounded-[6px] border border-neutral-700/50">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">
                                {!googleCalendarConnectionDialog ? "Connected" : "Authentication Required"}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                            {!googleCalendarConnectionDialog
                                ? "Your Google account is connected and ready to use"
                                : "Connect your Google account to access calendar features"
                            }
                        </p>
                    </div>

                    <div className="flex items-center gap-x-3">
                        <ToolTipComponent content={
                            <span>
                                Link your Google Calendar to ShelvR to create, sync, and manage events from one centralized place.
                            </span>
                        }>
                            <IoIosInformationCircleOutline
                                size={25}
                                className="hover:text-amber-500/70 p-[3px] rounded-[4px] text-amber-500 transition-colors ease-in cursor-pointer"
                            />
                        </ToolTipComponent>

                        {!googleCalendarConnectionDialog ? (
                            <Button
                                variant={"ghost"}
                                className="border-[1px] border-red-600 text-red-600 hover:bg-red-600/10 text-xs rounded-[8px] px-4 py-2 transition-all duration-300"
                            >
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                onClick={handleConnect}
                                className="flex items-center justify-center border-[1px] border-neutral-500 text-xs rounded-[8px] text-neutral-300"
                                variant={'ghost'}
                            >
                                <span className="relative flex items-center space-x-2">
                                    <Link />
                                    <span className="font-medium">Connect Now</span>
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS for custom animations */}
            <style jsx>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0) rotate(1deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(1deg);
                    }
                }
                
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}