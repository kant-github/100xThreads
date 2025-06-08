import { eventsCaseGoogleConnectAtom } from "@/recoil/atoms/events/eventsCaseGoogleConnectAtom"
import { useRecoilState } from "recoil"
import { EventChannelType } from "types/types";
import EventGoogleConnectProgressBar from "./EventGoogleConnectProgressBar";
import ConnectUserToGooglCalendar from "./ConnectUserToGooglCalendar";
import { Dispatch, SetStateAction } from "react";
import ConnectChannelToGooglCalendar from "./ConnectChannelToGooglCalendar";

interface EventsCaseBasedGoogleConnectRendererProps {
    channel: EventChannelType;
    setIsEventConnectedToGoogle: Dispatch<SetStateAction<boolean>>;
    
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

export default function EventsCaseBasedGoogleConnectRenderer({ channel, setIsEventConnectedToGoogle }: EventsCaseBasedGoogleConnectRendererProps) {

    const [eventsCaseBasedGoogleSteps, setEventsCaseBasedGoogleSteps] = useRecoilState(eventsCaseGoogleConnectAtom);

    function renderComponent() {
        switch (eventsCaseBasedGoogleSteps) {
            case 0:
                return <ConnectUserToGooglCalendar channel={channel} />
            case 1:
                return <ConnectChannelToGooglCalendar setIsEventConnectedToGoogle={setIsEventConnectedToGoogle} channel={channel} />
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