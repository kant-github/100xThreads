
import { EventChannelType } from "types/types";
import EventChannelTopBar from "../events-channel/EventChannelTopBar";
import EventsChannelrenderer from "../events-channel/EventsChannelrenderer";

interface EventChannelViewProps {
    channel: EventChannelType;
}

export default function ({ channel }: EventChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-neutral-900 w-full p-4">
            <EventChannelTopBar channel={channel} />
            <EventsChannelrenderer />
        </div>
    );
}
