import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebsocket";
import { ChannelType, PollTypes } from "types";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import PollOptionsAndResultsCard from "./PollOptionsAndResultsCard";
import PollCreationCard from "./PollCreationCard";

interface Props {
    maxOptions?: number;
    className?: string;
    pollCreationCard: boolean;
    setPollCreationCard: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType;
}

export default function PollCreation({ pollCreationCard, setPollCreationCard, channel }: Props) {
    const [pollOptionCard, setPollOptionCard] = useState<boolean>(false);
    const [poll, setPoll] = useState<PollTypes>({} as PollTypes);
    const { subscribeToChannel, unsubscribeChannel, sendMessage } = useWebSocket();
    const organization = useRecoilValue(organizationAtom);

    function newPollHandler(newMessage: any) {
        setPoll(newMessage);
        setPollCreationCard(false);
        setPollOptionCard(true);
    }

    useEffect(() => {
        if (organization?.id && channel.id && pollCreationCard === true) {

            const unSubscribeNewPoll = subscribeToChannel(
                channel.id,
                organization?.id,
                'new-poll',
                newPollHandler
            );

            return () => {
                unSubscribeNewPoll();
                unsubscribeChannel(channel.id, organization?.id, 'new-poll');
            };
        }
    }, [channel.id, organization?.id, pollCreationCard]);

    return (
        <>
            {pollCreationCard && <PollCreationCard channel={channel} sendMessage={sendMessage} pollCreationCard={pollCreationCard} setPollCreationCard={setPollCreationCard} />}
            {pollOptionCard && <PollOptionsAndResultsCard channel={channel} poll={poll} pollOptionCard={pollOptionCard} setPollOptionCard={setPollOptionCard} />}
        </>
    );
}