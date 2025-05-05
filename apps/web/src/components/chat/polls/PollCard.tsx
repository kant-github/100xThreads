import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebsocket";
import { ChannelType, PollTypes } from "types/types";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import PollOptionsAndResultsCard from "./PollOptionsAndResultsCard";
import PollCreationCard from "./PollCreationCard";
import { userSessionAtom } from "@/recoil/atoms/atom";
import axios from "axios";
import { POLL_URL } from "@/lib/apiAuthRoutes";

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
    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler, sendMessage } = useWebSocket();
    const organization = useRecoilValue(organizationAtom);
    const session = useRecoilValue(userSessionAtom);

    const getPolls = useCallback(async () => {
        if (!organization?.id || !channel.id || !session?.user?.token) {
            return;
        }

        try {
            const { data } = await axios.get(`${POLL_URL}/${organization.id}/${channel.id}`, {
                headers: {
                    authorization: `Bearer ${session.user.token}`,
                },
            });

            if (data.poll) {
                setPoll(data.poll);
                setPollOptionCard(true);
            }

        } catch (err) {
            console.error("Error in fetching polls:", err);
        }
    }, [organization?.id, channel.id, session?.user?.token]);

    useEffect(() => {
        getPolls();
    }, [getPolls]);

    function newPollHandler(newMessage: PollTypes) {
        setPoll(newMessage);
        setPollCreationCard(false);
        setPollOptionCard(true);
    }

    function pollVoteHandler(updatedPoll: PollTypes) {
        setPoll(updatedPoll);
    }

    useEffect(() => {
        if (organization?.id && channel.id) {
            subscribeToBackend(channel.id, organization?.id, 'new-poll');
            subscribeToBackend(channel.id, organization?.id, 'active-poll');
            const unSubscribeNewPoll = subscribeToHandler('new-poll', newPollHandler);
            const unsubscribeActivePoll = subscribeToHandler('active-poll', pollVoteHandler);

            return () => {
                unSubscribeNewPoll();
                unsubscribeActivePoll();
                unsubscribeFromBackend(channel.id, organization?.id, 'new-poll');
                unsubscribeFromBackend(channel.id, organization?.id, 'active-poll');
            };
        }
    }, [channel.id, organization?.id]);

    return (
        <>
            {pollCreationCard && (
                <PollCreationCard channel={channel} pollCreationCard={pollCreationCard} setPollCreationCard={setPollCreationCard} />
            )}
            {pollOptionCard && (
                <PollOptionsAndResultsCard channel={channel} poll={poll}  setPollOptionCard={setPollOptionCard} />
            )}
        </>
    );
}