import { EventChannelType } from "types/types";
import EventChannelTopBar from "../events-channel/EventChannelTopBar";
import EventsChannelrenderer from "../events-channel/EventsChannelrenderer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { useEffect, useState } from "react";
import GoogleCalendarConnectionDialog from "@/components/utility/GoogleCalendarConnectionDialog";
import isExpiredtoken from "@/lib/isExpiredToken";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import axios from "axios";
import { eventsForChannel } from "@/recoil/atoms/events/eventsForChannel";
import EventNotConnectedToGoogle from "../events-channel/EventNotConnectedToGoogle";
import EventsCaseBasedGoogleConnectRenderer from "../events-channel/EventsCaseBasedGoogleConnectRenderer";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function EventChannelView({ channel }: EventChannelViewProps) {

    const organizationUser = useRecoilValue(organizationUserAtom);
    const [showGoogleCalendarPage, setShowGoogleCalendarPage] = useState<boolean>(false);
    const [googleCalendarConnectionDialog, setGoogleCalendarConnectionDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const setEvents = useSetRecoilState(eventsForChannel);
    const [showDialoagBox, setShowDialoagBox] = useState<boolean>(false);
    const organizationId = useRecoilValue(organizationIdAtom);
    const session = useRecoilValue(userSessionAtom);


    useEffect(() => {
        if (!channel.google_calendar_id) {
            setShowGoogleCalendarPage(true);
        } else {
            setShowGoogleCalendarPage(false);
        }
    }, [channel.google_calendar_id]);

    useEffect(() => {
        const shouldShowDialog = !organizationUser?.user?.token_expires_at || isExpiredtoken(organizationUser?.user?.token_expires_at);

        if (shouldShowDialog) {
            setGoogleCalendarConnectionDialog(true);
            setShowDialoagBox(true);
        }
    }, [organizationUser?.user?.token_expires_at]);

    async function getEvents() {

        if (!organizationId || !session.user?.token) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${ORGANIZATION}/event/${channel.id}/${organizationId}`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })
            setEvents(data.data);
        } catch (err) {
            console.error("Error in fetching the events");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEvents();
    }, [])



    return (
        <div className="bg-primDark w-full">
            {/* {showDialoagBox && (<GoogleCalendarConnectionDialog setOpen={setShowDialoagBox} />)} */}
            {!showGoogleCalendarPage && channel.google_calendar_id && (
                <div className="px-6 pt-6">
                    <EventChannelTopBar
                        channel={channel}
                        setShowGoogleCalendarPage={setShowGoogleCalendarPage}
                    />
                    <EventsChannelrenderer channel={channel} />
                </div>
            )}

            {showGoogleCalendarPage && (
                <EventsCaseBasedGoogleConnectRenderer googleCalendarConnectionDialog={googleCalendarConnectionDialog} channel={channel} />
            )}
        </div>
    );
}
