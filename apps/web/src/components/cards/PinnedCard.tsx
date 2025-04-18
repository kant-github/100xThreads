import React, { useState, useRef } from 'react';
import { FaEye } from "react-icons/fa";
import { AnnouncementType } from 'types/types';
import { ImBullhorn } from "react-icons/im";
import { useRecoilValue } from 'recoil';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import PriorityTicker from '../utility/PriorityTicker';
import { RxCrossCircled } from "react-icons/rx";
import { RiExpandUpDownFill } from "react-icons/ri";
import WhiteText from '../heading/WhiteText';
import CompanyTagTicker from '../utility/CompanyTagTicker';
import { HiOutlineDotsVertical } from "react-icons/hi";
import AnnouncementOptionMenu from '../organization/announcement-channel/AnnouncementOptionMenu';
import GuardComponent from '@/rbac/GuardComponent';
import { Action, Subject } from 'types/permission';
import OptionImage from '../ui/OptionImage';

interface PinnedCardProps {
    className?: string;
    announcement: AnnouncementType;
}

export default function PinnedCard({ className, announcement }: PinnedCardProps) {
    const [open, setOpen] = useState<boolean>(false);
    const organization = useRecoilValue(organizationAtom);
    const [zoom, setZoom] = useState<boolean>(false);
    const optionRef = useRef<HTMLDivElement>(null);

    function optionClickHandler(e: React.MouseEvent<SVGElement, MouseEvent>) {
        e.stopPropagation();
        setOpen((prev) => !prev);
    }

    return (
        <div onClick={() => setZoom((prev) => !prev)}
            className={`relative flex flex-col items-start shadow-lg gap-y-4 select-none bg-neutral-900 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-[14px] w-full pt-8 px-5 pb-4 transition-all duration-300 ease-in-out ${zoom ? 'md:row-span-2 min-h-[11rem]' : 'min-h-[10rem]'} ${className} `}
        >
            <span className="flex items-center gap-x-1 absolute bottom-2 right-3 text-neutral-500">
                <FaEye size={12} />
                <span className="text-[8px]">12</span>
            </span>

            <GuardComponent action={Action.DELETE} subject={Subject.ANNOUNCEMENT}>
                <div ref={optionRef} className="absolute top-2.5 right-2 flex flex-col items-end">
                    <HiOutlineDotsVertical
                        size={14}
                        className="cursor-pointer"
                        onClick={optionClickHandler}
                    />
                    {open && (
                        <div className="absolute top-full -left-20 mt-2 z-[100]">
                            <AnnouncementOptionMenu open={open} setOpen={setOpen} announcement={announcement} />
                        </div>
                    )}
                </div>
            </GuardComponent>

            <div className="flex items-center justify-center gap-x-1 absolute top-2.5 left-3">
                <RxCrossCircled className="text-red-500 hover:text-red-900 bg-red-500 rounded-full transition-colors duration-200" size={8} />
                <RiExpandUpDownFill
                    className={`text-green-500 hover:text-green-900 bg-green-500 rounded-full transform transition-all duration-300 ease-in-out cursor-pointer ${zoom ? 'rotate-0' : '-rotate-45'} `}
                    size={8}
                />
            </div>

            <div className="flex flex-col items-start gap-y-1 text-neutral-300">
                <span className="text-md font-bold">{announcement.title}</span>
                <span className="text-[11px] transition-all duration-500 ease-in-out">
                    {announcement.content.slice(0, 120)}
                </span>
            </div>

            <OptionImage
                content={
                    <div className="flex items-center gap-x-2">
                        <WhiteText className="text-[10px] font-medium px-3 py-1 rounded-[4px] border-[1px] border-neutral-600 flex flex-row justify-start items-center gap-x-2 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                            <ImBullhorn />
                            {announcement.creator.user.name}
                        </WhiteText>
                        <PriorityTicker className="" tickerText={announcement.priority} />
                    </div>
                }
                userId={announcement.creator.user.id}
                organizationId={organization?.id!}
            />

            <div className={`transition-all w-full duration-700 ease-in-out flex flex-col gap-y-4 items-start ${zoom ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <div className="flex flex-row items-center justify-start gap-x-2 md:gap-x-3 text-xs flex-wrap ">
                    {announcement.tags.map((tag, tagIndex) => (
                        <CompanyTagTicker color={organization?.organizationColor} key={tagIndex}>{tag}</CompanyTagTicker>
                    ))}
                </div>
            </div>
        </div>
    );
}
