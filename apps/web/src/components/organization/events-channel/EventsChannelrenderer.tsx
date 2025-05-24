import CalendarRenderer from "@/components/calendar/CalendarRenderer";
import { EventChannelType } from "types/types";


interface EventsChannelrendererProps {
    channel: EventChannelType
}

export default function EventsChannelrenderer({ channel }: EventsChannelrendererProps) {
    return (
        <>
            <CalendarRenderer channel={channel} className="mt-32" />
        </>
    )
}