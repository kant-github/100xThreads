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

interface StoredPollState {
    poll: PollTypes;
    isVisible: boolean;
    channelId: string;
}

export default function PollCreation({ pollCreationCard, setPollCreationCard, channel }: Props) {
    const [pollOptionCard, setPollOptionCard] = useState<boolean>(false);
    const [poll, setPoll] = useState<PollTypes>({} as PollTypes);
    const { subscribeToChannel, unsubscribeChannel, sendMessage } = useWebSocket();
    const organization = useRecoilValue(organizationAtom);

    useEffect(() => {
        function loadStoredPollState() {
            const storedState = localStorage.getItem(`poll_state_${channel.id}`);
            if (storedState) {
                const { poll: storedPoll, isVisible, channelId } = JSON.parse(storedState) as StoredPollState;

                if (channelId === channel.id && !isPollExpired(storedPoll)) {
                    setPoll(storedPoll);
                    setPollOptionCard(isVisible);
                } else {
                    localStorage.removeItem(`poll_state_${channel.id}`);
                }
            }
        };

        loadStoredPollState();
    }, [channel.id]);


    useEffect(() => {
        function checkExpiration() {
            if (poll.expiresAt && isPollExpired(poll)) {
                handlePollDismissal();
            }
        };

        const expirationTimer = setInterval(checkExpiration, 1000);

        return () => clearInterval(expirationTimer);
    }, [poll]);

    function isPollExpired(poll: PollTypes): boolean {
        if (!poll.expiresAt) return false;
        return new Date(poll.expiresAt) < new Date();
    };

    const storePollState = (newPoll: PollTypes, isVisible: boolean) => {
        const stateToStore: StoredPollState = {
            poll: newPoll,
            isVisible,
            channelId: channel.id
        };
        localStorage.setItem(`poll_state_${channel.id}`, JSON.stringify(stateToStore));
    };

    function handlePollDismissal() {
        setPollOptionCard(false);
        localStorage.removeItem(`poll_state_${channel.id}`);
    }

    function newPollHandler(newMessage: PollTypes) {
        setPoll(newMessage);
        setPollCreationCard(false);
        setPollOptionCard(true);
        storePollState(newMessage, true);
    }

    function pollVoteHandler(updatedPoll: PollTypes) {
        setPoll(updatedPoll);
        storePollState(updatedPoll, true);
    }

    useEffect(() => {
        if (organization?.id && channel.id) {
            const unSubscribeNewPoll = subscribeToChannel(channel.id, organization?.id, 'new-poll', newPollHandler);
            const unsubscribeActivePoll = subscribeToChannel(channel.id, organization?.id, 'active-poll', pollVoteHandler);

            return () => {
                unSubscribeNewPoll();
                unsubscribeActivePoll();
                unsubscribeChannel(channel.id, organization?.id, 'new-poll');
                unsubscribeChannel(channel.id, organization?.id, 'active-poll');
            };
        }
    }, [channel.id, organization?.id]);

    return (
        <>
            {pollCreationCard && (
                <PollCreationCard
                    channel={channel}
                    sendMessage={sendMessage}
                    pollCreationCard={pollCreationCard}
                    setPollCreationCard={setPollCreationCard}
                />
            )}
            {pollOptionCard && (
                <PollOptionsAndResultsCard
                    sendMessage={sendMessage}
                    channel={channel}
                    poll={poll}
                    pollOptionCard={pollOptionCard}
                    setPollOptionCard={setPollOptionCard}
                    onDismiss={handlePollDismissal}
                />
            )}
        </>
    );
}