import UtilityCard from "@/components/utility/UtilityCard";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { ChannelType, PollTypes } from "types/types";
import { ImBullhorn } from "react-icons/im";
import WhiteText from "@/components/heading/WhiteText";
import { useWebSocket } from "@/hooks/useWebsocket";
import OptionImage from "@/components/ui/OptionImage";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";

interface PollOptionsAndResultsProps {
    setPollOptionCard: Dispatch<SetStateAction<boolean>>;
    poll: PollTypes;
    channel: ChannelType;
}

export default function PollOptionsAndResults({
    setPollOptionCard,
    poll,
    channel,
}: PollOptionsAndResultsProps) {
    const session = useRecoilValue(userSessionAtom);
    const containerRef = useRef<HTMLDivElement>(null);
    const { sendMessage } = useWebSocket();
    const totalVotes = poll.votes.length;
    const userVote = poll.votes.find(votes => votes.user_id === Number(session.user?.id));
    const [selectedOption, setSelectedOption] = useState<string | null>(userVote ? userVote.option_id : null);
    const organizationId = useRecoilValue(organizationIdAtom);

    function calculatePercentage(optionId: string) {
        if (totalVotes === 0) return;
        const optionVotes = poll.votes.filter(vote => vote.option_id === optionId).length;
        return Math.round((optionVotes / totalVotes) * 100);
    }


    function handleVoteSelect(optionId: string) {
        setSelectedOption(optionId);
        const newMessage = {
            optionId: optionId,
            pollId: poll.id,
            userId: session.user?.id
        }
        sendMessage(newMessage, channel.id, 'active-poll');
    };


    return (
        <div ref={containerRef} className=" absolute bottom-10 right-0 z-[100] flex">
            <UtilityCard className="w-80 bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-700 relative">
                <div className="my-1">
                    <h3 className="text-sm ml-2 font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                        {poll.question}
                    </h3>
                </div>

                <div className="flex flex-col gap-3">
                    {poll.options.map((option) => {
                        const isSelected = selectedOption === option.id;
                        const percentage = calculatePercentage(option.id);
                        return (
                            <div key={option.id} className="relative" >
                                <div
                                    className="absolute left-0 top-0 h-full bg-yellow-100 dark:bg-yellow-600/20 rounded-[8px] transition-all ease-in z-20"
                                    style={{ width: `${percentage}%` }}
                                />

                                <button
                                    type="button"
                                    className={`relative w-full py-2.5 px-3 rounded-[8px] dark:bg-[#1f1f1f] border font-normal ${isSelected
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
                                                className="h-4 w-4 z-50 accent-yellow-500"
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

                <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 flex justify-between items-center mx-2">
                    <span>{totalVotes} votes</span>
                    {poll.expires_at && (
                        <span>
                            Expires {new Date(poll.expires_at).toLocaleDateString()}
                        </span>
                    )}
                    <OptionImage
                        userId={poll.creator.id}
                        organizationId={organizationId!}
                        content={
                            <WhiteText className="text-[10px] font-medium px-3 py-1 rounded-[4px] border-[1px] border-neutral-600 flex flex-row justify-start items-center gap-x-2 cursor-pointer dark:hover:bg-neutral-800 dark:bg-neutral-800 transition-colors duration-200">
                                <ImBullhorn />
                                {poll.creator.name}
                            </WhiteText>
                        }
                    />
                </div>
                <button onClick={() => setPollOptionCard(false)} aria-label="cut" type="button" className="flex flex-row items-center justify-center py-1 bg-red-600/10 px-2 border-red-600/60 border-[1px] hover:bg-red-600/20 disabled:bg-red-600/90 disabled:cursor-not-allowed text-red-600 rounded-[6px] absolute top-3 right-3 transition-all ease-in">
                    <span className="text-red-600 text-xs font-medium" >Dismiss</span>
                </button>
            </UtilityCard>
        </div>
    );
}