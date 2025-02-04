import TransparentButton from "@/components/buttons/TransparentButton";
import PinnedCard from "@/components/cards/PinnedCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { CgMathPlus } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { AnnouncementType, ChannelType } from "types";

interface AnnouncementChannelMessagesProps {
    announcementData: AnnouncementType[];
    channel: ChannelType;
}

export default function ({ announcementData, channel }: AnnouncementChannelMessagesProps) {
    const organization = useRecoilValue(organizationAtom);
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <TransparentButton className="absolute top-6 right-3 group mr-4" color={organization?.organizationColor}>
                <CgMathPlus size={16} />
                Create Announcement
            </TransparentButton>
            <DashboardComponentHeading description={channel.description!}> {channel.title} </DashboardComponentHeading>
            <UtilityCard className='p-8 w-full flex-grow mt-4 dark:bg-neutral-800'>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 relative'>
                    {announcementData.map((announcement) => (
                        <div key={announcement.id} className="relative">
                            <PinnedCard announcement={announcement} />
                        </div>
                    ))}
                </div>
            </UtilityCard>
        </div>
    )
}