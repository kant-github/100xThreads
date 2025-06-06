import { eventsCaseGoogleConnectAtom } from "@/recoil/atoms/events/eventsCaseGoogleConnectAtom"
import { useRecoilState } from "recoil"
import EventNotConnectedToGoogle from "./EventNotConnectedToGoogle";
import { EventChannelType } from "types/types";
import EventGoogleConnectProgressBar from "./EventGoogleConnectProgressBar";
import ConnectGooglCalendar from "./ConnectGooglCalendar";

interface EventsCaseBasedGoogleConnectRendererProps {
    channel: EventChannelType;
    googleCalendarConnectionDialog: boolean;
}

const steps = [
    {
        id: '1',
        title: 'step 1'
    }, {
        id: '2',
        title: 'step 2'
    }
]

export default function EventsCaseBasedGoogleConnectRenderer({ channel, googleCalendarConnectionDialog }: EventsCaseBasedGoogleConnectRendererProps) {

    const [eventsCaseBasedGoogleSteps, setEventsCaseBasedGoogleSteps] = useRecoilState(eventsCaseGoogleConnectAtom);

    function renderComponent() {
        switch (eventsCaseBasedGoogleSteps) {
            case 0:
                return <ConnectGooglCalendar channel={channel} />
            case 1:
                return <EventNotConnectedToGoogle channel={channel} />
        }
    }

    return (
        <div className="h-full pt-6 flex flex-col">
            <EventGoogleConnectProgressBar className="" steps={steps} currentStep={eventsCaseBasedGoogleSteps} setCurrentStep={setEventsCaseBasedGoogleSteps} totalLevels={1} />
            <div className="flex-1">
                {renderComponent()}
            </div>
        </div>
    )
}