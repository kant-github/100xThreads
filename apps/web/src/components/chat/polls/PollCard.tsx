import { Dispatch, SetStateAction, useEffect } from "react";
import PollCreationCard from "./PollCreationCard";
import { useWebSocket } from "@/hooks/useWebsocket";
import { ChannelType } from "types";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";

interface Props {
    maxOptions?: number;
    className?: string;
    pollCreationCard: boolean;
    setPollCreationCard: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType;
}

export default function PollCreation({ pollCreationCard, setPollCreationCard, channel }: Props) {
    const { subscribeToChannel, unsubscribeChannel, sendMessage } = useWebSocket();
    const organization = useRecoilValue(organizationAtom);

    function newPollHandler(newMessage: any) {
        console.log("newPollHandler called with message:", newMessage);
    }

    useEffect(() => {
        if (organization?.id && channel.id && pollCreationCard === true) {
            console.log("Setting up poll subscription");

            const unSubscribeNewPoll = subscribeToChannel(
                channel.id,
                organization?.id,
                'new-poll',
                newPollHandler
            );

            return () => {
                console.log("Cleanup function called");
                unSubscribeNewPoll();
                unsubscribeChannel(channel.id, organization?.id, 'new-poll');
            };
        }
    }, [channel.id, organization?.id, pollCreationCard]);

    return (
        <>
            {pollCreationCard && <PollCreationCard channel={channel} sendMessage={sendMessage} pollCreationCard={pollCreationCard} setPollCreationCard={setPollCreationCard} />}
        </>
    );
}