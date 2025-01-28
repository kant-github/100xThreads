import UtilityCard from "@/components/utility/UtilityCard";
import { useWebSocket } from "@/hooks/useWebsocket";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { ChannelType, PollTypes } from "types";


interface PollOptionsAndResultsProps {
    pollOptionCard: boolean;
    setPollOptionCard: Dispatch<SetStateAction<boolean>>;
    poll: PollTypes;
    channel: ChannelType;
}

export default function PollOptionsAndResults({
    pollOptionCard,
    setPollOptionCard,
    poll,
    channel
}: PollOptionsAndResultsProps) {
    const organization = useRecoilValue(organizationAtom);
    const session = useRecoilValue(userSessionAtom);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { subscribeToChannel, unsubscribeChannel, sendMessage } = useWebSocket();

    function activePollHandler(newMessages: any) {
        console.log("active poll handler recieved : ", newMessages);
    }

    useEffect(() => {
        if (organization?.id && channel.id) {
            const unsubscribeActivePoll = subscribeToChannel(organization.id, channel.id, 'active-poll-handler', activePollHandler);

            return () => {
                unsubscribeChannel(organization.id, channel.id, 'active-poll-handler');
                unsubscribeActivePoll();
            }
        }
    }, [])

    const totalVotes = poll.votes.length;

    function getVotePercentage(optionId: string) {
        const optionVotes = poll.options.find(opt => opt.id === optionId)?.votes.length || 0;
        if (totalVotes === 0) return 0;
        return Math.round((optionVotes / totalVotes) * 100);
    };


    function handleVoteSelect(optionId: string) {
        setSelectedOption(optionId);
        const newMessage = {
            optionId: optionId,
            pollId: poll.id,
            userId: session.user?.id
        }
        sendMessage(newMessage, channel.id, 'active-poll-handler');
    };

    function handlePollDismissal() {
        setPollOptionCard(false);
    }

    return (
        <div ref={containerRef} className="sticky bottom-0 right-0 z-[100] flex">
            <UtilityCard className="w-80 bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                    {poll.question}
                </h3>

                <div className="flex flex-col gap-3">
                    {poll.options.map((option) => {
                        const percentage = getVotePercentage(option.id);
                        const isSelected = selectedOption === option.id;

                        return (
                            <div key={option.id} className="relative" >
                                <div
                                    className="absolute left-0 top-0 h-full bg-yellow-100 dark:bg-yellow-900/50 rounded-[8px] transition-all"
                                    style={{ width: `${percentage}%` }}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleVoteSelect(option.id)}
                                    className={`relative w-full py-2.5 px-3 rounded-[8px] border font-normal ${isSelected
                                        ? 'border-yellow-500 dark:border-yellow-600'
                                        : 'border-neutral-200 dark:border-neutral-700'
                                        } hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="check"
                                                type={poll.multipleChoice ? "checkbox" : "radio"}
                                                checked={isSelected}
                                                onChange={() => handleVoteSelect(option.id)}
                                                className="h-4 w-4 accent-yellow-500"
                                            />
                                            <label htmlFor="check" className="text-xs font-normal text-neutral-900 dark:text-neutral-100">
                                                {option.text}
                                            </label>
                                        </div>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {percentage}%
                                        </span>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 flex justify-between items-center">
                    <span>{totalVotes} votes</span>
                    {poll.expiresAt && (
                        <span>
                            Expires {new Date(poll.expiresAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <button
                    type='button'
                    onClick={handlePollDismissal}
                    // disabled={!question.trim() || options.some(opt => !opt.trim()) || isSubmitting}
                    className="flex items-center justify-center gap-2 bg-red-600/10 border-red-600 border-[1px] hover:bg-red-600/90 disabled:bg-red-600/90 disabled:cursor-not-allowed text-red-900 font-medium px-4 py-2.5 rounded-[8px] mx-auto w-full text-center text-xs mt-2"
                >

                    Dismiss
                </button>
            </UtilityCard>
        </div>
    );
}