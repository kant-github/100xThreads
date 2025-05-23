import { useRecoilState, useRecoilValue } from "recoil"
import WhiteText from "../heading/WhiteText";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { BiSolidParty } from "react-icons/bi";
import { organizationChannelsAtom, organizationEventChannelsAtom, organizationWelcomeChannelAtom } from '@/recoil/atoms/organizationAtoms/organizationChannelAtoms'
import { selectedChannelIdAtom } from "@/recoil/atoms/organizationAtoms/organizationDashboardManagement";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import Image from "next/image";
import { ChannelTypeType } from "types/types";
import { IoIosLock } from "react-icons/io";



export const baseDivStyles = "flex items-center justify-start gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide hidden sm:block";

export default function () {
    const eventRooms = useRecoilValue(organizationEventChannelsAtom);
    const channels = useRecoilValue(organizationChannelsAtom);
    const welcomeChannel = useRecoilValue(organizationWelcomeChannelAtom);
    const [selectedChannelId, setSelectedChannelId] = useRecoilState(selectedChannelIdAtom);
    const organization = useRecoilValue(organizationAtom);

    return (
        <div className="h-auto sm:h-24 py-1 sm:py-2 rounded-[8px]">
            <div onClick={() => setSelectedChannelId('default')} className={`px-2 py-1.5 bg-neutral-800 rounded-[8px] cursor-pointer select-none`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-3">
                        <span className="relative">
                            <Image src={"/images/100xDevs-logo.png"} alt="user-image" width={30} height={32} className="rounded-full" />
                        </span>
                        <span className="text-[14px] text-neutral-100 font-medium mt-0.5 tracking-wide">
                            {organization?.name}
                        </span>
                    </div>
                </div>
            </div>
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 mt-3 select-none">
                <span className="text-[13px]">recent joinees</span>
                <BiSolidParty />
            </WhiteText>
            <div className="mt-1">
                <Option type={ChannelTypeType.WELCOME} onClick={() => setSelectedChannelId(welcomeChannel?.id!)} isSelected={selectedChannelId === welcomeChannel?.id} key={welcomeChannel?.id} label={"Welcome"} />
            </div>
            <div className="border-b-[0.5px] border-neutral-600 my-2" />
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span className="text-[13px]">general</span>
                <MdMeetingRoom />
            </WhiteText>
            <div className="mt-1">
                {
                    channels.map((channel) => (
                        <Option type={channel.type} onClick={() => setSelectedChannelId(channel.id)} isSelected={selectedChannelId === channel.id} key={channel.id} label={channel.title} />
                    ))
                }
            </div>
            <div className="border-b-[0.5px] border-neutral-600 my-2" />
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span className="text-[13px]">events</span>
                <MdEvent />
            </WhiteText>
            <div className="mt-1">
                {
                    eventRooms.map((eventChannel) => (
                        <Option type={ChannelTypeType.EVENT} onClick={() => setSelectedChannelId(eventChannel.id)} isSelected={selectedChannelId === eventChannel.id} key={eventChannel.id} label={eventChannel.title} />
                    ))
                }
            </div>
        </div>
    )
}


const disabledChannelTypes: ChannelTypeType[] = [
    ChannelTypeType.RESOURCE,
    ChannelTypeType.HELP_DESK,
    // ChannelTypeType.EVENT
];


function Option({
    isSelected,
    onClick,
    label,
    type,
}: {
    isSelected?: boolean;
    onClick?: () => void;
    label: string;
    type: ChannelTypeType;
}) {
    const isDisabled = disabledChannelTypes.includes(type);

    return (
        <div
            onClick={!isDisabled ? onClick : undefined}
            className={`${baseDivStyles} ${isSelected ? "bg-neutral-700 text-white" : "hover:bg-neutral-800"
                } ${isDisabled ? "pointer-events-none cursor-not-allowed" : ""}`}
        >
            <div className="flex items-center justify-between w-full">
                <span className={`${textStyles}`}>{label}</span>
                {
                    isDisabled && (
                        <span className="flex justify-center gap-x-1 rounded-full items-center bg-yellow-600/50 border border-yellow-500 px-2 py-0.5">
                            <span className="text-neutral-800 dark:text-neutral-300 text-[9px]">upcoming</span>
                            <IoIosLock className="text-neutral-800 dark:text-neutral-300" size={10} />
                        </span>
                    )
                }
            </div>
        </div>
    );
}
