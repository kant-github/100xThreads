'use client'
import OpacityBackground from "@/components/ui/OpacityBackground";
import UtilityCard from "@/components/utility/UtilityCard";
import { EventType, OrganizationTagType } from "types/types";
import { getStatusColor } from "./EventCard";
import { Clock, Edit2, ExternalLink, Map, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ToolTipComponent from "@/components/ui/ToolTipComponent";
import AppLogo from "@/components/heading/AppLogo";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/apiAuthRoutes";
import OrganizationTagTicker from "@/components/utility/tickers/OrganizationTagTicker";
import GlobalSingleEventModalSkeleton from "@/components/skeletons/GlobalSingleEventModalSkeleton";
import Link from "next/link";
import OptionImage from "@/components/ui/OptionImage";
import CalendarEventForm from "@/components/calendar/event-form/CalendarEventForm";

export function getStatusText(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

interface GlobalSingleEventModalProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
    isOrgPage: boolean
    selectedEventId: string;
}

export default function GlobalSingleEventModal({ selectedEventId, setOpen, isOrgPage }: GlobalSingleEventModalProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const [event, setEvent] = useState<EventType | null>(null);
    const [tags, setTags] = useState<OrganizationTagType[]>([]);
    const [openeditEventModal, setOpeneditEventModal] = useState<boolean>(false);

    async function getEvents() {
        if (!session?.user?.token || !selectedEventId) {
            return;
        }

        try {
            setLoading(true);
            await new Promise(t => setTimeout(t, 1000)); // Your delay
            const { data } = await axios.get(`${API_URL}/event/${selectedEventId}`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })
            console.log(data.event);
            setEvent(data.event);
            setTags(data.tags);
        } catch (err) {
            console.error("Error in fetching the events");
            setEvent(null);
            setTags([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (selectedEventId) {
            setEvent(null);
            setTags([]);

            if (session?.user?.token) {
                getEvents();
            }
        }
    }, [session?.user?.token, selectedEventId])

    return (
        <OpacityBackground
            className={loading || !event ? "" : "bg-terDark"}
            onBackgroundClick={() => setOpen(false)}
        >
            {loading || !event ? (
                <GlobalSingleEventModalSkeleton />
            ) : (
                <UtilityCard className="w-8/12 bg-primDark grid grid-cols-4 h-[50%] border-[1px] border-neutral-800 rounded-[6px] relative ">
                    <section className={cn("border-r-[1px] border-neutral-800 col-span-1 py-6 px-6",
                        "flex flex-col justify-between gap-y-2"
                    )}>
                        <div className="flex flex-col gap-y-3">
                            <div>
                                <Image className="rounded-full" width={40} height={80} src={"/images/100xDevs-logo.png"} alt="logo" />
                                <span className="text-neutral-300 text-lg font-bold">100xDevs</span>
                            </div>

                            <div className="flex flex-col gap-y-3">
                                <span className="flex items-center gap-x-2 text-sm font-medium text-neutral-200 tracking-wide">
                                    <Clock size={14} />
                                    1 hour
                                </span>
                                <div className="flex flex-row items-center gap-x-2">
                                    {
                                        event.location?.mode === 'ONLINE' ? (
                                            <Link target="_blank" rel="noopener noreferrer" href={event.meet_link!} className="flex items-center gap-x-2 ">
                                                <Image
                                                    src="/images/google-meet.png"
                                                    height={19}
                                                    width={19}
                                                    unoptimized
                                                    alt="Google Meet"
                                                    className="object-contain"
                                                />
                                                <span className="mb-[1px] text-sm text-neutral-100">{event.location.name}</span>
                                                <ExternalLink size={14} />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-x-2">
                                                <Map size={18} className="text-amber-500/80" />
                                                <span className="text-xs text-neutral-100">{event.location?.name} - {event.location?.address}</span>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="text-xs text-neutral-300 flex flex-col gap-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span className="font-medium text-neutral-400">Starts:</span>
                                        <span>12 July 3:00 AM</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span className="font-medium text-neutral-400">Ends:</span>
                                        <span>12 July 4:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AppLogo />
                    </section>

                    <section className="px-6 col-span-2 py-6 flex flex-col justify-between gap-y-2">
                        <div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                                {getStatusText(event.status)}
                            </div>
                            <h1 className="text-xl font-bold text-neutral-300 mt-2">
                                {event.title}
                            </h1>
                            <p className="text-[13px] text-neutral-400 tracking-wide">
                                {event.description}
                            </p>

                            <div className="mt-3 flex flex-col gap-y-2">
                                <span className="text-xs text-neutral-300 font-medium">Invited tags</span>
                                <div className="flex items-center justify-start ">
                                    {tags.length > 0 && tags.map((tag, index) => (
                                        <OrganizationTagTicker key={index} tag={tag} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-end items-center">
                            <Image src="/images/event-image-6.svg" width={100} height={100} alt="Event preview" unoptimized className="invert" />
                        </div>
                    </section>

                    <section className={cn("border-l-[1px] border-neutral-800 col-span-1 py-6 px-4",
                        "flex flex-col gap-y-2 h-full min-h-0"
                    )}>
                        <div className="flex flex-row gap-x-2 flex-shrink-0">
                            {
                                isOrgPage && (
                                    <>
                                        <ToolTipComponent content="Edit event">
                                            <Edit2 onClick={() => setOpeneditEventModal(true)} size={31} className="text-neutral-200 dark:bg-neutral-400/20 hover:bg-neutral-500 transition-colors p-[7px] rounded-[4px]" />
                                        </ToolTipComponent>
                                        <ToolTipComponent content="Delete event">
                                            <Trash size={28} className="text-neutral-100 bg-red-600/80 hover:bg-red-600 transition-colors p-1.5 rounded-[4px]" />
                                        </ToolTipComponent>
                                    </>
                                )
                            }

                        </div>

                        <span className="text-xs text-neutral-300 font-medium flex-shrink-0">Invited Users</span>

                        <div className="flex flex-col gap-y-1.5 overflow-y-auto min-h-0 flex-1">
                            {event.attendees && event.attendees.length > 0 ? (
                                event.attendees.map((attendee, index) => (
                                    <OptionImage
                                        userId={attendee.user_id}
                                        content={
                                            <div
                                                key={index}
                                                className="w-full px-2 py-2 border-[1px] border-neutral-800 hover:border hover:border-neutral-600 rounded-[8px] flex items-center justify-start gap-x-2 flex-shrink-0"
                                            >
                                                <Image
                                                    src={attendee.user.image}
                                                    width={18}
                                                    height={18}
                                                    alt="user"
                                                    className="rounded-full h-6 w-6"
                                                />
                                                <span className="text-xs text-neutral-100 font-medium">
                                                    {attendee.user.name}
                                                </span>
                                            </div>
                                        }
                                    />
                                ))
                            ) : (
                                <div className="text-xs text-neutral-400 text-center py-4">
                                    No attendees yet
                                </div>
                            )}
                        </div>
                    </section>
                </UtilityCard>
            )}

            {openeditEventModal && <CalendarEventForm
                channelId={event?.event_room_id!}
                isOpen={openeditEventModal}
                setIsOpen={setOpeneditEventModal}
                isEditMode={true}
                start_time={new Date(event?.start_time!)}
                end_time={new Date(event?.end_time!)}
                title={event?.title}
                description={event?.description}
                status={event?.status}
                location={event?.location?.id}
                tags={event?.linkedTags}
            />}
        </OpacityBackground>
    )
}