import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import UtilityCard from "@/components/utility/UtilityCard";
import { CalendarClock, Hourglass, Link } from "lucide-react";
import Image from "next/image";
import { EventChannelType } from "types/types";

interface EventNotConnectedToGoogleProps {
    channel: EventChannelType;
}

export default function EventNotConnectedToGoogle({ channel }: EventNotConnectedToGoogleProps) {
    return (
        <div className="overflow-hidden relative h-full">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-yellow-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-neutral-500/10 rounded-full blur-md animate-pulse delay-500"></div>
            </div>

            {/* Main calendar image */}
            <div className="absolute -bottom-[22%] -right-0 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent rounded-[16px] blur-sm"></div>

                    {/* Feature badges */}
                    <div className="absolute -top-12 left-4 flex items-center gap-x-4 z-10">
                        <div className="group relative">
                            {/* <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-[8px] blur-sm group-hover:blur-none transition-all duration-300"></div> */}
                            <div className="relative flex items-center gap-x-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-3 py-2 rounded-[8px] border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="w-6 h-6 bg-white rounded-full p-1 shadow-sm">
                                    <Image
                                        src="/images/google-calendar.png"
                                        height={16}
                                        width={16}
                                        unoptimized
                                        priority
                                        alt="Google Calendar logo"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Calendar</span>
                            </div>
                        </div>

                        <div className="group relative">
                            {/* <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-[8px] blur-sm group-hover:blur-none transition-all duration-300"></div> */}
                            <div className="relative flex items-center gap-x-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-3 py-2 rounded-[8px] border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="w-6 h-6 bg-white rounded-full p-1 shadow-sm">
                                    <Image
                                        src="/images/google-meet.png"
                                        height={16}
                                        width={16}
                                        unoptimized
                                        priority
                                        alt="Google Meet logo"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Meet</span>
                            </div>
                        </div>
                    </div>


                    {/* Main container */}
                    <div className="relative rounded-[16px] p-[6px] border-[1px] border-dashed border-neutral-300/40 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm shadow-2xl">
                        <div className="relative overflow-hidden rounded-[10px] border-[1px] border-neutral-700">
                            <Image
                                src={"/images/calendar-page.png"}
                                width={600}
                                height={400}
                                alt="calendar-page"
                                className="rounded-[10px] opacity-80 hover:opacity-100 transition-opacity duration-300"
                                unoptimized
                                priority
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
                    <DashboardComponentHeading
                        description="Connecting this channel to Google Calendar allows you to schedule, update, and sync events effortlessly with your Google account."
                    >
                        {`${channel.title} is not yet connected to Google Calendar.`}
                    </DashboardComponentHeading>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">

                        <UtilityCard className="group relative flex items-center gap-x-3 border-[1px] border-neutral-700 px-6 py-5">
                            <div className="bg-amber-500 p-1.5 rounded-[4px]">
                                <CalendarClock className="text-neutral-950" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Auto Sync</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Real-time event synchronization</p>
                            </div>
                        </UtilityCard>
                        <UtilityCard className="group relative flex items-center gap-x-3 border-[1px] border-neutral-700 px-6 py-5">
                            <div className="bg-amber-500 p-1.5 rounded-[4px]">
                                <Hourglass className="text-neutral-950" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Smart Scheduling</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Intelligent conflict detection</p>
                            </div>
                        </UtilityCard>
                    </div>
                </div>

                {/* Call to action area */}
                <div className="flex w-full items-center justify-between bg-neutral-800/80 backdrop-blur-sm px-6 py-3 rounded-[6px] border border-neutral-700/50">

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Connection Required</span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                            Connect to unlock powerful calendar management features
                        </p>
                    </div>

                    <Button className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-neutral-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95 border border-amber-400/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-neutral-100/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                        <span className="relative flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span>Connect Now</span>
                        </span>
                    </Button>
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
            transform: tranneutralY(0) rotate(12deg);
          }
          50% {
            transform: tranneutralY(-10px) rotate(12deg);
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