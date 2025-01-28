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
    const [pollOptioncCard, setPollOptionCard] = useState<boolean>(true);
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
            {pollOptioncCard && <PollOptionsAndResultsCard poll={poll} pollOptioncCard={pollOptioncCard} setPollOptionCard={setPollOptionCard} />}
        </>
    );
}



// channel_id
// : 
// "620924a2-6a49-4809-8cfc-cf11f83f9449"
// created_at
// : 
// "2025-01-28T09:32:03.582Z"
// creator
// : 
// {id: 1, name: 'Rishi Kant', email: 'kantrishi7779@gmail.com', bio: '', provider: 'google', …}
// creator_id
// : 
// 1
// expires_at
// : 
// null
// id
// : 
// "88171ee6-1e83-4c83-b475-815e5505824e"
// is_anonymous
// : 
// false
// multiple_choice
// : 
// false
// options
// : 
// (2) [{…}, {…}]
// question
// : 
// "Are you good"
// status
// : 
// "ACTIVE"