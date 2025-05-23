
import { EventChannelType } from "types/types";
import EventChannelTopBar from "../events-channel/EventChannelTopBar";
import EventsChannelrenderer from "../events-channel/EventsChannelrenderer";
import { useRecoilValue } from "recoil";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { useEffect, useState } from "react";
import GoogleCalendarConnectionDialog from "@/components/utility/GoogleCalendarConnectionDialog";
import isExpiredtoken from "@/lib/isExpiredToken";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function ({ channel }: EventChannelViewProps) {
    const organizationUser = useRecoilValue(organizationUserAtom);
    const [show, setShow] = useState<boolean>(false);

    async function handleDialogBoxCheck() {
        const shouldShowDialog = !organizationUser.user.token_expires_at ||
            isExpiredtoken(organizationUser.user.token_expires_at);

        console.log(organizationUser);
        setTimeout(() => {
            if (shouldShowDialog) {
                setShow(true);
            } else {
                setShow(false);
            }
        }, 2000)
    }

    useEffect(() => {
        handleDialogBoxCheck();
    }, [organizationUser.user.token_expires_at]);
    return (
        <div className="bg-neutral-900 w-full p-4">
            {show && <GoogleCalendarConnectionDialog />}
            <EventChannelTopBar channel={channel} />
            <EventsChannelrenderer />
        </div>
    );
}
