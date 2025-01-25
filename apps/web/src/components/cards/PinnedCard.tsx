import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { AnnouncementType } from 'types';
import { ImBullhorn } from "react-icons/im";
import { useRecoilValue } from 'recoil';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import PriorityTicker from '../utility/PriorityTicker';
import { RxCrossCircled } from "react-icons/rx";
import { RiExpandUpDownFill } from "react-icons/ri";
import WhiteText from '../heading/WhiteText';
import CompanyTagTicker from '../utility/CompanyTagTicker';
import { WhiteBtn } from '../buttons/WhiteBtn';

interface PinnedCardProps {
    className?: string;
    announcement: AnnouncementType;
}

export default function PinnedCard({ className, announcement }: PinnedCardProps) {
    const organization = useRecoilValue(organizationAtom);
    const [zoom, setZoom] = useState<boolean>(false);

    return (
        <div onClick={() => setZoom(prev => !prev)} className={`relative flex flex-col items-start gap-y-4 select-none bg-neutral-900 rounded-[14px] shadow-lg w-full pt-8 px-5 pb-4 transition-all duration-300 ease-in-out hover:scale-[1.01] ${zoom ? 'md:row-span-2 h-72' : 'h-40'} ${className} `}>
            <span className='flex items-center gap-x-1 absolute bottom-2 right-3 text-neutral-500'>
                <FaEye className='' size={12} />
                <span className='text-[8px]'>12</span>
            </span>
            <div className='flex items-center justify-center gap-x-1 absolute top-2.5 left-3'>
                <RxCrossCircled className='text-red-500 hover:text-red-900 bg-red-500 rounded-full transition-colors duration-200' size={8} />
                <RiExpandUpDownFill className={`text-green-500 hover:text-green-900  bg-green-500 rounded-full  transform transition-all duration-300 ease-in-out cursor-pointer ${zoom ? 'rotate-0' : '-rotate-45'} `} size={8} />
            </div>
            <PriorityTicker className='absolute top-2 right-2' tickerText={announcement.priority} />
            <div className='flex flex-col items-start gap-y-1 text-neutral-300'>
                <span className='text-md font-bold'>{announcement.title}</span>
                <span className='text-[11px] transition-all duration-500 ease-in-out'>
                    {announcement.content.slice(0, 120)}
                </span>
            </div>

            <WhiteText className="text-[10px] font-medium px-3 py-1 rounded-[4px] border-[1px] border-neutral-600 flex flex-row justify-start items-center gap-x-2 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <ImBullhorn />
                {"Rishi Kant"}
            </WhiteText>

            <div className={`transition-all w-full duration-700 ease-in-out flex flex-col gap-y-4 items-start ${zoom ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <div className='flex flex-row items-center justify-start gap-x-2 md:gap-x-3 text-xs flex-wrap '>
                    {announcement.tags.map((tag, tagIndex) => (
                        <CompanyTagTicker color={organization?.organizationColor} key={tagIndex}>{tag}</CompanyTagTicker>
                    ))}
                </div>
                <div className={`w-full flex flex-col gap-y-3 justify-start px-8` }>
                    <span className='text-xs flex justify-center font-medium text-neutral-300'>Acknowledge this announcement</span>
                    <WhiteBtn>Acknowledge</WhiteBtn>
                </div>
            </div>
        </div>
    );
}