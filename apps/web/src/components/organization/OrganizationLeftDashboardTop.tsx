import { useRecoilState, useRecoilValue } from "recoil"
import WhiteText from "../heading/WhiteText";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { BiSolidParty } from "react-icons/bi";
import { organizationChannelsAtom, organizationEventChannelsAtom, organizationWelcomeChannelAtom } from '@/recoil/atoms/organizationAtoms/organizationChannelAtoms'
import { selectedChannelIdAtom } from "@/recoil/atoms/organizationAtoms/organizationDashboardManagement";

export const baseDivStyles = "flex items-center justify-start gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide hidden sm:block";

export default function () {
    const eventRooms = useRecoilValue(organizationEventChannelsAtom);
    const channels = useRecoilValue(organizationChannelsAtom);
    const welcomeChannel = useRecoilValue(organizationWelcomeChannelAtom);
    const [selectedChannelId, setSelectedChannelId] = useRecoilState(selectedChannelIdAtom);


    return (
        <div className="h-auto sm:h-24 py-1 sm:py-2 rounded-[8px]">
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span className="text-[13px]">recent joinees</span>
                <BiSolidParty />
            </WhiteText>
            <div className="mt-2">
                <Option onClick={() => setSelectedChannelId(welcomeChannel?.id!)} isSelected={selectedChannelId === welcomeChannel?.id} key={welcomeChannel?.id} label={"Welcome"} />
            </div>
            <div className="border-b-[0.5px] border-zinc-600 my-2" />
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span className="text-[13px]">general</span>
                <MdMeetingRoom />
            </WhiteText>
            <div className="mt-2">
                {
                    channels.map((channel) => (
                        <Option onClick={() => setSelectedChannelId(channel.id)} isSelected={selectedChannelId === channel.id} key={channel.id} label={channel.title} />
                    ))
                }
            </div>
            <div className="border-b-[0.5px] border-zinc-600 my-2" />
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span className="text-[13px]">events</span>
                <MdEvent />
            </WhiteText>
            <div className="mt-2">
                {
                    eventRooms.map((eventChannel) => (
                        <Option onClick={() => setSelectedChannelId(eventChannel.id)} isSelected={selectedChannelId === eventChannel.id} key={eventChannel.id} label={eventChannel.title} />
                    ))
                }
            </div>
        </div>
    )
}

function Option({ isSelected, onClick, label }: {
    isSelected?: boolean;
    onClick?: () => void;
    label: string;
}) {
    return (
        <div onClick={onClick} className={`${baseDivStyles} ${isSelected ? "bg-zinc-700 text-white" : "hover:bg-zinc-800"}`}>
            <span className={`${textStyles}`}>{label}</span>
        </div>
    );
}