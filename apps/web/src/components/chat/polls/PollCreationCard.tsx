import { useState, ChangeEvent, Dispatch, SetStateAction, useRef, useEffect } from 'react';
import UtilityCard from "@/components/utility/UtilityCard";
import { Plus, Trash2 } from "lucide-react";
import { ChannelType } from 'types';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';

export interface PollData {
    question: string;
    options: string[];
    expiresIn: string;
    isAnonymous: boolean;
    multipleChoice: boolean;
    channelId: string
    userId: string
}

type ExpirationOption = '1h' | '6h' | '12h' | '24h' | '48h' | '1w';

interface Props {
    maxOptions?: number;
    className?: string;
    pollCreationCard: boolean;
    setPollCreationCard: Dispatch<SetStateAction<boolean>>;
    sendMessage: (pollData: PollData, channelId: string, type: string) => void;
    channel: ChannelType
}

export default function ({
    setPollCreationCard,
    sendMessage,
    maxOptions = 10,
    channel
}: Props) {
    const [question, setQuestion] = useState<string>('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [expiresIn, setExpiresIn] = useState<ExpirationOption>('1h');
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [multipleChoice, setMultipleChoice] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const pollOptionCardRef = useRef<HTMLDivElement | null>(null);
    const session = useRecoilValue(userSessionAtom);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (pollOptionCardRef.current && !pollOptionCardRef.current.contains(e.target as Node)) {
                setPollCreationCard(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    const addOption = (): void => {
        if (options.length < maxOptions) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number): void => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const updateOption = (index: number, value: string): void => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (): Promise<void> => {
        if (!question.trim() || options.some(opt => !opt.trim())) return;

        const pollData: PollData = {
            question: question.trim(),
            options: options.map(opt => opt.trim()),
            expiresIn,
            isAnonymous,
            multipleChoice,
            channelId: channel.id,
            userId: session.user?.id!
        };

        try {

            setIsSubmitting(true);
            sendMessage(pollData, channel.id, 'new-poll');

            setQuestion('');
            setOptions(['', '']);
            setExpiresIn('1h');
            setIsAnonymous(false);
            setMultipleChoice(false);
        } catch (error) {
            console.error('Failed to create poll:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setQuestion(e.target.value);
    };

    const handleOptionChange = (index: number) => (e: ChangeEvent<HTMLInputElement>): void => {
        updateOption(index, e.target.value);
    };

    const handleExpirationChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setExpiresIn(e.target.value as ExpirationOption);
    };


    return (
        <div ref={pollOptionCardRef} className={`sticky bottom-0 z-[100] max-w-[40%]`}>
            <UtilityCard className={`bg-white dark:bg-neutral-900 px-4 py-3  border-[0.5px] border-neutral-700 `}>
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            value={question}
                            onChange={handleQuestionChange}
                            className="w-full px-3 py-2 bg-transparent border rounded-[8px] dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs text-[13px]"
                        />
                    </div>

                    <div className="space-y-2">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={handleOptionChange(index)}
                                    className="flex-1 px-3 py-2 bg-transparent border rounded-[8px] dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs text-[13px]"
                                />
                                {options.length > 2 && (
                                    <button
                                        aria-label='delete'
                                        onClick={() => removeOption(index)}
                                        type="button"
                                        className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-[8px]">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Poll Settings */}
                    <div className="flex items-center gap-4 text-sm">
                        {options.length < maxOptions && (
                            <button
                                onClick={addOption}
                                type="button"
                                className="flex items-center gap-2 text-neutral-300 text-xs hover:bg-blue-600 bg-blue-600/50 border-[1px] border-blue-600 transition-all duration-100 px-3 py-2 rounded-[8px]"
                            >
                                <Plus size={18} />
                                Add Option
                            </button>
                        )}
                        <select
                            title='sdv'
                            value={expiresIn}
                            onChange={handleExpirationChange}
                            className="bg-transparent border rounded-[8px] dark:border-neutral-700 px-2 py-1"
                        >
                            <option className='text-[9px]' value="1h">1 hour</option>
                            <option className='text-[9px]' value="6h">6 hours</option>
                            <option className='text-[9px]' value="12h">12 hours</option>
                            <option className='text-[9px]' value="24h">24 hours</option>
                            <option className='text-[9px]' value="48h">48 hours</option>
                            <option className='text-[9px]' value="1w">1 week</option>
                        </select>
                    </div>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={!question.trim() || options.some(opt => !opt.trim()) || isSubmitting}
                        className="flex items-center justify-center gap-2 bg-blue-600/80 hover:bg-blue-600 disabled:bg-blue-600/90 disabled:cursor-not-allowed text-neutral-300 px-4 py-2.5 rounded-[8px] mx-auto w-full text-center text-xs"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Poll'}
                    </button>
                </div>
            </UtilityCard>
        </div>
    );
}


