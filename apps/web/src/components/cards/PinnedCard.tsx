import React, { useState } from 'react';
import { AnnouncementType } from 'types';
import { ImBullhorn } from "react-icons/im";
import { useRecoilValue } from 'recoil';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import PriorityTicker from '../utility/PriorityTicker';
import { RxCrossCircled } from "react-icons/rx";
import { RiExpandUpDownFill } from "react-icons/ri";
import WhiteText from '../heading/WhiteText';
import CompanyTagTicker from '../utility/CompanyTagTicker';

interface PinnedCardProps {
    className?: string;
    announcement: AnnouncementType;
}

export default function PinnedCard({ className, announcement }: PinnedCardProps) {
    const organization = useRecoilValue(organizationAtom);
    const [zoom, setZoom] = useState<boolean>(false);

    return (
        <div
            className={`
                relative flex flex-col items-start gap-y-4 select-none
                bg-[#171717] rounded-[6px] shadow-lg
                w-full pt-8 px-5 pb-4
                transition-all duration-300 ease-in-out
                hover:scale-[1.01]
                ${zoom ? 'md:row-span-2 h-56' : 'h-40'}
                ${className}
            `}
        >
            <div className='flex items-center justify-center gap-x-1 absolute top-2 left-2'>
                <RxCrossCircled
                    className='text-red-500 hover:text-red-900 bg-red-500 rounded-full transition-colors duration-200'
                    size={8}
                />
                <RiExpandUpDownFill
                    onClick={() => setZoom(prev => !prev)}
                    className={`
                        text-green-500 hover:text-green-900 
                        bg-green-500 rounded-full 
                        transform transition-all duration-300 ease-in-out
                        ${zoom ? 'rotate-0' : '-rotate-45'}
                    `}
                    size={8}
                />
            </div>
            <PriorityTicker className='absolute top-2 right-2' tickerText={announcement.priority} />

            <div className='flex flex-col items-start gap-y-1 text-zinc-300'>
                <span className='text-md font-bold'>{announcement.title}</span>
                <span className='text-[11px] transition-all duration-500 ease-in-out'>
                    {announcement.content.slice(0, 120)}
                </span>
            </div>

            <WhiteText className="text-[10px] font-medium px-3 py-1 rounded-[4px] border-[1px] border-zinc-600 flex flex-row justify-start items-center gap-x-2 cursor-pointer hover:bg-zinc-800 transition-colors duration-200">
                <ImBullhorn />
                {"Rishi Kant"}
            </WhiteText>

            <div className={`
                flex flex-row gap-x-2 md:gap-x-3 text-xs flex-wrap
                transition-all duration-500 ease-in-out
                ${zoom ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}
            `}>
                {announcement.tags.map((tag, tagIndex) => (
                    <CompanyTagTicker
                        color={organization?.organizationColor}
                        key={tagIndex}
                    >
                        {tag}
                    </CompanyTagTicker>
                ))}
            </div>
        </div>
    );
}