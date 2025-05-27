import { EventChannelType } from "types/types";
import EventChannelTopBar from "../events-channel/EventChannelTopBar";
import EventsChannelrenderer from "../events-channel/EventsChannelrenderer";
import { useRecoilValue } from "recoil";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { useEffect, useState } from "react";
import GoogleCalendarConnectionDialog from "@/components/utility/GoogleCalendarConnectionDialog";
import isExpiredtoken from "@/lib/isExpiredToken";
import EventNotConnectedComponent from "../events-channel/EventNotConnectedComponent";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function EventChannelView({ channel }: EventChannelViewProps) {

    const organizationUser = useRecoilValue(organizationUserAtom);
    const [showGoogleCalendarPage, setShowGoogleCalendarPage] = useState<boolean>(false);
    const [googleCalendarConnectionDialog, setGoogleCalendarConnectionDialog] = useState<boolean>(false);
    const [showDialoagBox, setShowDialoagBox] = useState<boolean>(false);
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


    return (
        <div className="bg-neutral-900 w-full p-4">
            {showDialoagBox && (<GoogleCalendarConnectionDialog setOpen={setShowDialoagBox} />)}
            {!showGoogleCalendarPage && channel.google_calendar_id && (
                <>
                    <EventChannelTopBar
                        channel={channel}
                        setShowGoogleCalendarPage={setShowGoogleCalendarPage}
                    />
                    <EventsChannelrenderer channel={channel} />
                </>
            )}

            {showGoogleCalendarPage && (
                <EventNotConnectedComponent googleCalendarConnectionDialog={googleCalendarConnectionDialog} setShowGoogleCalendarPage={setShowGoogleCalendarPage} channel={channel} />
            )}
        </div>
    );
}
