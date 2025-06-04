import { EventChannelType } from "types/types";
import EventCalendar from "./EventCalendar";

interface CalendarRenderedProps {
    channel: EventChannelType
    className?: string
}

export default function ({ className, channel }: CalendarRenderedProps) {
    return (
        <div className={`${className} `}>
            <EventCalendar channel={channel} className="" />
        </div>
    )
}