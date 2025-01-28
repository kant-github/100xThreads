import UtilityCard from "@/components/utility/UtilityCard";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { PollStatus, PollTypes } from "types";

export const dummyPoll: PollTypes = {
    id: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b",
    channelId: "3b12a855-88f1-4bca-92dd-fd6b3332f88c",
    question: "What's your favorite programming language?",
    options: [
        {
            id: "e91e63b1-9e78-4cb3-a2f6-9d9a64b9c1dc",
            pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b",
            text: "JavaScript",
            votes: [
                { id: 1, pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b", optionId: "e91e63b1-9e78-4cb3-a2f6-9d9a64b9c1dc", userId: 101, createdAt: "2025-01-27T14:00:00.000Z" },
                { id: 2, pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b", optionId: "e91e63b1-9e78-4cb3-a2f6-9d9a64b9c1dc", userId: 102, createdAt: "2025-01-27T14:10:00.000Z" },
            ],
            createdAt: "2025-01-27T12:00:00.000Z",
        },
        {
            id: "6b27f21e-a79a-47ab-8c69-c64e7dfc2459",
            pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b",
            text: "Python",
            votes: [
                { id: 3, pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b", optionId: "6b27f21e-a79a-47ab-8c69-c64e7dfc2459", userId: 103, createdAt: "2025-01-27T14:15:00.000Z" },
            ],
            createdAt: "2025-01-27T12:05:00.000Z",
        },
        {
            id: "caa8b60e-15d6-4b3b-98f7-2c931c9f7e65",
            pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b",
            text: "TypeScript",
            votes: [],
            createdAt: "2025-01-27T12:10:00.000Z",
        },
    ],
    creatorId: 100,
    createdAt: "2025-01-27T12:00:00.000Z",
    expiresAt: "2025-01-29T12:00:00.000Z",
    isAnonymous: false,
    multipleChoice: false,
    status: PollStatus.ACTIVE,
    votes: [
        { id: 1, pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b", optionId: "e91e63b1-9e78-4cb3-a2f6-9d9a64b9c1dc", userId: 101, createdAt: "2025-01-27T14:00:00.000Z" },
        { id: 2, pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b", optionId: "e91e63b1-9e78-4cb3-a2f6-9d9a64b9c1dc", userId: 102, createdAt: "2025-01-27T14:10:00.000Z" },
        { id: 3, pollId: "b5e8a755-77e7-4a8e-99d2-9e6342d68e5b", optionId: "6b27f21e-a79a-47ab-8c69-c64e7dfc2459", userId: 103, createdAt: "2025-01-27T14:15:00.000Z" },
    ],
};

interface PollOptionsAndResultsProps {
    pollOptionCard: boolean;
    setPollOptionCard: Dispatch<SetStateAction<boolean>>;
    poll: PollTypes;
}

export default function PollOptionsAndResults({
    pollOptionCard,
    setPollOptionCard,
    poll
}: PollOptionsAndResultsProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate total votes for percentage
    const totalVotes = dummyPoll.votes.length;

    // Calculate percentage for each option
    const getVotePercentage = (optionId: string) => {
        const optionVotes = dummyPoll.options.find(opt => opt.id === optionId)?.votes.length || 0;
        if (totalVotes === 0) return 0;
        return Math.round((optionVotes / totalVotes) * 100);
    };

    // Handle vote selection
    const handleVoteSelect = (optionId: string) => {
        if (!dummyPoll.multipleChoice) {
            setSelectedOption(optionId);
        }
    };

    return (
        <div ref={containerRef} className="sticky bottom-0 right-0 ml-40 z-[100] flex">
            <UtilityCard className="w-80 bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                    {dummyPoll.question}
                </h3>

                <div className="flex flex-col gap-3">
                    {dummyPoll.options.map((option) => {
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
                                    className={`relative w-full py-2.5 px-3 rounded-[8px] border text-[10px] font-normal ${isSelected
                                        ? 'border-yellow-500 dark:border-yellow-600'
                                        : 'border-neutral-200 dark:border-neutral-700'
                                        } hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="check"
                                                type={dummyPoll.multipleChoice ? "checkbox" : "radio"}
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

                {/* Footer */}
                <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 flex justify-between items-center">
                    <span>{totalVotes} votes</span>
                    {dummyPoll.expiresAt && (
                        <span>
                            Expires {new Date(dummyPoll.expiresAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </UtilityCard>
        </div>
    );
}