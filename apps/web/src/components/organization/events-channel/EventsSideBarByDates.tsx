import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import EventCard from "./EventCard";
import GlobalSingleEventModal from "./GlobalSingleEventModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UtilitySideBar from "@/components/utility/UtilitySideBar";
import { useRecoilValue } from "recoil";
import { EventChannelType, EventType } from "types/types";
import { userSessionAtom } from "@/recoil/atoms/atom";
import axios from "axios";
import { EVENT_URL } from "@/lib/apiAuthRoutes";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton";

interface EventSideBarByDatesProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    channel: EventChannelType;
    date: Date | null;
}

export default function EventsSideBarByDates({ open, setOpen, channel, date }: EventSideBarByDatesProps) {
    const [events, setEvents] = useState<EventType[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const session = useRecoilValue(userSessionAtom);
    const organizationId = useRecoilValue(organizationIdAtom);

    async function getEventsByDates() {
        if (!date) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${EVENT_URL}/get-channel-events-by-date/${organizationId}/${channel.id}/${date}`, {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`
                }
            })
            if (data.success) {
                setEvents(data.data);
            }
        } catch (err) {
            console.log("Error in fetching events for channel by dates");
        } finally {
            setLoading(false);
        }
    }

    function handleEventClick(eventId: string) {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (open && date) {
            getEventsByDates()
        }
    }, [open, date])

    // Early return AFTER all hooks have been called
    if (!date) return null;

    // Filter events based on search
    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchFilter)
    );

    return (
        <UtilitySideBar
            width="[30%]"
            open={open}
            setOpen={setOpen}
            content={
                <div className="px-5 py-3 flex flex-col h-full">
                    <div className="flex-shrink-0">
                        <DashboardComponentHeading description={`Events scheduled for ${date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}`}>
                            {channel.title} - {date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </DashboardComponentHeading>
                    </div>
                    <div className="relative w-full mt-3">
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            onChange={(e) => setSearchFilter(e.target.value.toLowerCase())}
                            className={cn(
                                `pl-8 pr-2 py-1 text-xs font-light text-neutral-100 placeholder:text-neutral-100 placeholder:text-xs`,
                                `outline-none border border-neutral-700 rounded-[8px]`,
                                `w-full`
                            )}
                            placeholder="Search events by title"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 space-y-4 min-h-0 scrollbar-hide">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => <EventCardSkeleton key={index} />)
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    setOpen={setOpen}
                                    onEventClick={handleEventClick}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
                                <p className="text-sm">No events found</p>
                                {searchFilter && (
                                    <p className="text-xs mt-1">Try adjusting your search</p>
                                )}
                            </div>
                        )}
                    </div>

                    {isModalOpen && selectedEventId && (
                        <GlobalSingleEventModal
                            isOrgPage={true}
                            setOpen={setIsModalOpen}
                            selectedEventId={selectedEventId}
                        />
                    )}
                </div>
            }
        />
    );
}