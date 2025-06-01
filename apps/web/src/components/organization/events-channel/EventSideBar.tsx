import UtilitySideBar from "@/components/utility/UtilitySideBar";
import { Dispatch, SetStateAction, useState } from "react";
import EventCard from "./EventCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { EventChannelType } from "types/types";
import { useRecoilValue } from "recoil";
import { eventsForChannel } from "@/recoil/atoms/events/eventsForChannel";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import GlobalSingleEventModal from "./GlobalSingleEventModal";

interface EventSideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    channel: EventChannelType;
}

export default function EventSideBar({ open, setOpen, channel }: EventSideBarProps) {
    const events = useRecoilValue(eventsForChannel);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    function handleEventClick(eventId: string) {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    return (
        <UtilitySideBar
            width="[30%]"
            open={open}
            setOpen={setOpen}
            content={
                <div className="px-5 py-3 flex flex-col h-full">
                    <div className="flex-shrink-0">
                        <DashboardComponentHeading description="All your events in one place.">
                            {channel.title} - Events
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
                        {events
                            .filter((event) =>
                                event.title.toLowerCase().includes(searchFilter)
                            )
                            .map((event) => (
                                <EventCard key={event.id} event={event} setOpen={setOpen} onEventClick={handleEventClick} />
                            ))}
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