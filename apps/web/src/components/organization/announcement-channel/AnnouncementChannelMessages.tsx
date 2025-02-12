import TransparentButton from "@/components/buttons/TransparentButton";
import PinnedCard from "@/components/cards/PinnedCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import CreateAnnouncementForm from "@/components/form/CreateAnnouncementForm";
import UtilityCard from "@/components/utility/UtilityCard";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessages";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { useEffect, useState } from "react";
import { CgMathPlus } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { ChannelType } from "types";
import EmptyAnnouncementChannelMessage from "./EmptyAnnouncementChannelMessage";

interface AnnouncementChannelMessagesProps {
    channel: ChannelType;
}

export default function ({ channel }: AnnouncementChannelMessagesProps) {
    const organization = useRecoilValue(organizationAtom);
    const announcementChannelMessages = useRecoilValue(announcementChannelMessgaes);
    const [createAnnoucementModal, setCreateAnnouncementModal] = useState<boolean>(false);

    useEffect(() => {
        console.log("anouncement hannel messages changes it : ", announcementChannelMessages);
    }, [announcementChannelMessages])

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <div className="mr-4 absolute top-6 right-3">
                <TransparentButton
                    onClick={() => setCreateAnnouncementModal(prev => !prev)}
                    className="group"
                    color={organization?.organizationColor}
                >
                    <CgMathPlus size={16} />
                    Create Announcement
                </TransparentButton>
                {createAnnoucementModal && (
                    <CreateAnnouncementForm
                        channel={channel}
                        createAnnoucementModal={createAnnoucementModal}
                        setCreateAnnouncementModal={setCreateAnnouncementModal}
                        className="z-50"
                    />
                )}
            </div>
            <DashboardComponentHeading description={channel.description!}>
                {channel.title}
            </DashboardComponentHeading>
            <UtilityCard className='p-8 w-full flex-1 mt-4 dark:bg-neutral-800 flex flex-col min-h-0'>
                <div className='w-full h-full overflow-y-auto scrollbar-hide'>
                    {!announcementChannelMessages.length ? (
                        <div className="h-full flex items-center justify-center">
                            <EmptyAnnouncementChannelMessage setCreateAnnouncementModal={setCreateAnnouncementModal} />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mx-4'>
                            {announcementChannelMessages.map((announcement) => (
                                <div key={announcement.id} className="relative">
                                    <PinnedCard announcement={announcement} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </UtilityCard>
        </div>
    )
}