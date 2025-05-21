import PinnedCard from "@/components/cards/PinnedCard";
import UtilityCard from "@/components/utility/UtilityCard";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessagesAtom";
import { Dispatch, SetStateAction } from "react";
import { useRecoilValue } from "recoil";
import { ChannelType } from "types/types";
import EmptyAnnouncementChannelMessage from "./EmptyAnnouncementChannelMessage";

interface AnnouncementChannelMessagesProps {
    channel: ChannelType;
    setCreateAnnouncementModal: Dispatch<SetStateAction<boolean>>
}

export default function ({ channel, setCreateAnnouncementModal }: AnnouncementChannelMessagesProps) {
    const announcementChannelMessages = useRecoilValue(announcementChannelMessgaes);

    return (
        <div className="w-full flex flex-col flex-1 min-h-0">
            <UtilityCard className='p-8 w-full flex-1 mt-4 dark:bg-terDark flex flex-col min-h-0 shadow-lg shadow-black/20'>
                <div className='w-full h-full overflow-y-auto scrollbar-hide'>
                    {!announcementChannelMessages.length ? (
                        <div className="h-full flex items-center justify-center">
                            <EmptyAnnouncementChannelMessage setCreateAnnouncementModal={setCreateAnnouncementModal} />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mx-4'>
                            {announcementChannelMessages.map((announcement) => (
                                <div key={announcement.id}>
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