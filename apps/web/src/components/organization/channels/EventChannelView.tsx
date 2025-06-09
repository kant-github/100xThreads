import { EventChannelType } from "types/types";
import EventChannelTopBar from "../events-channel/EventChannelTopBar";
import EventsChannelrenderer from "../events-channel/EventsChannelrenderer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import axios from "axios";
import { eventsForChannel } from "@/recoil/atoms/events/eventsForChannel";
import EventsCaseBasedGoogleConnectRenderer from "../events-channel/EventsCaseBasedGoogleConnectRenderer";
import UtilityCard from "@/components/utility/UtilityCard";
import GooglCalendar from "../events-channel/GoogleCalendar";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function EventChannelView({ channel }: EventChannelViewProps) {
    const [isEventConnectedToGoogle, setIsEventConnectedToGoogle] = useState<boolean>(false);
    const [showGoogleCalendarPage, setShowGoogleCalendarPage] = useState<boolean>(false);
    const setEvents = useSetRecoilState(eventsForChannel);
    const organizationId = useRecoilValue(organizationIdAtom);
    const session = useRecoilValue(userSessionAtom);


    useEffect(() => {
        if (channel.google_calendar_id) {
            setIsEventConnectedToGoogle(true);
        } else {
            setIsEventConnectedToGoogle(false);
        }
    }, [channel.google_calendar_id]);

    async function getEvents() {

        if (!organizationId || !session.user?.token) {
            return;
        }

        try {
            const { data } = await axios.get(`${ORGANIZATION}/event/${channel.id}/${organizationId}`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })
            setEvents(data.data);
        } catch (err) {
            console.error("Error in fetching the events");
        }
    }

    useEffect(() => {
        getEvents();
    }, [])

    return (
        <UtilityCard className="bg-primDark w-full">
            {isEventConnectedToGoogle && (
                <UtilityCard className="px-6 pt-6">
                    <EventChannelTopBar
                        channel={channel}
                        setShowGoogleCalendarPage={setShowGoogleCalendarPage}
                        setIsEventConnectedToGoogle={setIsEventConnectedToGoogle}
                        showGoogleCalendarPage={showGoogleCalendarPage}
                    />

                    {showGoogleCalendarPage ? (
                        <GooglCalendar channel={channel} setShowGoogleCalendarPage={setShowGoogleCalendarPage} />
                    ) : <EventsChannelrenderer channel={channel} />}
                </UtilityCard>
            )}

            {!isEventConnectedToGoogle && (
                <EventsCaseBasedGoogleConnectRenderer channel={channel} setIsEventConnectedToGoogle={setIsEventConnectedToGoogle} />
            )}

        </UtilityCard>
    );
}
