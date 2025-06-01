import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { myEventsAtom } from "@/recoil/atoms/events/myEventsAtom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import EventCard from "../organization/events-channel/EventCard";
import DashboardComponentHeading from "./DashboardComponentHeading";
import EventCardSkeleton from "../skeletons/EventCardSkeleton";
import GlobalSingleEventModal from "../organization/events-channel/GlobalSingleEventModal";

export default function EventsDashboard() {
    const session = useRecoilValue(userSessionAtom);
    const [myEvents, setMyEvents] = useRecoilState(myEventsAtom);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);


    async function getEvents() {

        if (!session.user?.token) {
            return;
        }

        try {
            setLoading(true);
            await new Promise(t => setTimeout(t, 1000));
            const { data } = await axios.get(`${API_URL}/my-events`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })
            setMyEvents(data.data);
        } catch (err) {
            console.error("Error in fetching the events");
        } finally {
            setLoading(false);
        }
    }

    function handleEventClick(eventId: string) {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    useEffect(() => {
        // getEvents();
    }, [])

    return (
        <div className="bg-[#37474f] dark:bg-neutral-900 h-full relative flfex flex-col">
            <DashboardComponentHeading className="pt-4 pl-12" description="Browse through the organizations which previously joined">All organizations</DashboardComponentHeading>
            <div className="my-8 mx-10 rounded-[8px] flex-grow px-2">
                {
                    !loading ? (
                        <div className="grid grid-cols-3 gap-6">
                            {
                                myEvents.length > 0 && myEvents.map(event => <EventCard event={event} onEventClick={handleEventClick} />)
                            }
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
                            {Array.from({ length: 3 }, (_, index) => (
                                <EventCardSkeleton key={index} />
                            ))}
                        </div>
                    )

                }
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