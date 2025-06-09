import { myEventsAtom } from "@/recoil/atoms/events/myEventsAtom";
import { useState } from "react";
import EventCard from "../organization/events-channel/EventCard";
import DashboardComponentHeading from "./DashboardComponentHeading";
import GlobalSingleEventModal from "../organization/events-channel/GlobalSingleEventModal";
import { useRecoilValue } from "recoil";

export default function EventsDashboard() {
    const myEvents = useRecoilValue(myEventsAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    function handleEventClick(eventId: string) {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-[#37474f] dark:bg-neutral-900 h-full relative flfex flex-col">
            <DashboardComponentHeading className="pt-4 pl-12" description="Browse through the organizations which previously joined">All organizations</DashboardComponentHeading>
            <div className="my-8 mx-10 rounded-[8px] flex-grow px-2">
                <div className="grid grid-cols-3 gap-6">
                    {
                        myEvents.length > 0 && myEvents.map(event => <EventCard event={event} onEventClick={handleEventClick} />)
                    }
                </div>
                {isModalOpen && selectedEventId && (
                    <GlobalSingleEventModal
                        isOrgPage={false}
                        setOpen={setIsModalOpen}
                        selectedEventId={selectedEventId}
                    />
                )}
            </div>
        </div>
    )
}