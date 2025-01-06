import { organizationChannelOptionAtom } from "@/recoil/atoms/organizationChannelOptionAtom";
import { organizationChannels, organizationEventChannels, organizationWelcomeChannel } from "@/recoil/atoms/organizationMetaDataAtom"
import { useRecoilState, useRecoilValue } from "recoil"
import WhiteText from "../heading/WhiteText";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { BiSolidParty } from "react-icons/bi";

export const baseDivStyles = "flex items-center justify-start gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide hidden sm:block";

export default function () {
    const eventRooms = useRecoilValue(organizationEventChannels);
    const channels = useRecoilValue(organizationChannels);
    const welcomeChannel = useRecoilValue(organizationWelcomeChannel);
    console.log("welcome channel is : ", welcomeChannel);
    const [organizationChannelOption, setOrganizationChannelOption] = useRecoilState(organizationChannelOptionAtom);

    return (
        <div className="h-auto sm:h-24 py-1 sm:py-2 rounded-[8px]">
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span>#Welcome</span>
                <BiSolidParty />
            </WhiteText>
            <div className="mt-1">
                <Option onClick={() => setOrganizationChannelOption(welcomeChannel.id)} isSelected={organizationChannelOption === welcomeChannel.id} key={welcomeChannel.id} label={"On boarders"} />
            </div>
            <div className="border-b-[0.5px] border-zinc-600 my-2" />
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span>#General</span>
                <MdMeetingRoom />
            </WhiteText>
            <div className="mt-1">
                {
                    channels.map((channel) => (
                        <Option onClick={() => setOrganizationChannelOption(channel.id)} isSelected={organizationChannelOption === channel.id} key={channel.id} label={channel.title} />
                    ))
                }
            </div>
            <div className="border-b-[0.5px] border-zinc-600 my-2" />
            <WhiteText className="ml-3 text-sm flex items-center justify-between mx-2 select-none">
                <span>#Events</span>
                <MdEvent />
            </WhiteText>
            <div className="mt-1">
                {
                    eventRooms.map((eventChannel) => (
                        <Option onClick={() => setOrganizationChannelOption(eventChannel.id)} isSelected={organizationChannelOption === eventChannel.id} key={eventChannel.id} label={eventChannel.title} />
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