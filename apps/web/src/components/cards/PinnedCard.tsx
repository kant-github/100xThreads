import React from 'react';
import { AnnouncementType } from 'types';
import DashboardComponentHeading from '../dashboard/DashboardComponentHeading';
import { useRecoilValue } from 'recoil';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { GiPaperClip } from "react-icons/gi";
import CompanyTagTicker from '../utility/CompanyTagTicker';
import PriorityTicker from '../utility/PriorityTicker';
import { FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { RiExpandUpDownFill } from "react-icons/ri";


interface PinnedCardProps {
    className?: string;
    announcement: AnnouncementType;
}

export default function PinnedCard({ className, announcement }: PinnedCardProps) {
    const organization = useRecoilValue(organizationAtom);
    return (
        <div className={`relative bg-zinc-700 rounded-[6px] shadow-lg transition-transform duration-200 hover:scale-[1.02] w-[100%] ${className}`}>
            {/* Pin */}
            {/* <GiPaperClip size={24} className='absolute -top-3 left-1/2 -translate-x-1/2 transform -rotate-12 text-[#ff0033]' /> */}

            <div className='h-8 w-full bg-[#1f1f1f] rounded-t-[6px] flex items-center justify-between gap-x-2 px-3' >
                <div className='flex items-center justify-center gap-x-1.5'>
                    <RxCrossCircled className='text-red-500 hover:text-red-900 bg-red-500 rounded-full' size={10} />
                    <RiExpandUpDownFill className='text-green-500 hover:text-green-900 bg-green-500 rounded-full transform -rotate-45' size={10} />
                </div>
                <div className='flex items-center justify-center gap-x-2 text-yellow-500'>
                    <FaEye className='' size={12} />
                    <span className='text-[6px] font-light'> 12 views</span>
                </div>
            </div>
            <div className='flex items-start flex-col justify-center px-8 py-4 relative'>
                {/* <PriorityTicker tickerText={announcement.priority} className='absolute top-2 right-2' /> */}
                <DashboardComponentHeading description={announcement.content.slice(0, 90)}>{announcement.title}</DashboardComponentHeading>
                {/* <div className="flex flex-row gap-x-2 md:gap-x-3 text-xs flex-wrap mt-2">
                    {
                        announcement.tags.map((tag, tagIndex) => (
                            <CompanyTagTicker color={organization?.organizationColor} key={tagIndex}>{tag}</CompanyTagTicker>
                        ))
                    }
                </div> */}
            </div>

        </div>
    );
}