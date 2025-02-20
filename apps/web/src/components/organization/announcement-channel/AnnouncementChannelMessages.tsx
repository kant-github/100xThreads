import PinnedCard from "@/components/cards/PinnedCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessagesAtom";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { ChannelType } from "types/types";
import EmptyAnnouncementChannelMessage from "./EmptyAnnouncementChannelMessage";

import AnnouncementChannelTopBar from "./AnnouncementChannelTopBar";
import { useWebSocket } from "@/hooks/useWebsocket";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";

interface AnnouncementChannelMessagesProps {
    channel: ChannelType;
}

export default function ({ channel }: AnnouncementChannelMessagesProps) {
    const announcementChannelMessages = useRecoilValue(announcementChannelMessgaes);
    const [createAnnoucementModal, setCreateAnnouncementModal] = useState<boolean>(false);
    const organizationId = useRecoilValue(organizationIdAtom);
    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();

    function handleIncomingAnnouncemennts(newMessage: any) {
        console.log(newMessage);
    }

    useEffect(() => {
        if (channel.id && organizationId) {
            subscribeToBackend(channel.id, organizationId, 'create-announcement-messages');
            subscribeToBackend(channel.id, organizationId, 'edit-announcement-messages');
            subscribeToBackend(channel.id, organizationId, 'delete-announcement-messages');
            const unsubscribeIncomingAnnouncementHandler = subscribeToHandler('create-announcement-messages', handleIncomingAnnouncemennts);
            return () => {
                unsubscribeIncomingAnnouncementHandler();
                unsubscribeFromBackend(channel.id, organizationId, 'create-announcement-messages');
            }
        }
    }, [channel.id, organizationId])

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <AnnouncementChannelTopBar createAnnoucementModal={createAnnoucementModal} setCreateAnnouncementModal={setCreateAnnouncementModal} channel={channel} />
            <DashboardComponentHeading description={channel.description!}>
                {channel.title}
            </DashboardComponentHeading>
            <UtilityCard className='p-8 w-full flex-1 mt-4 dark:bg-neutral-800 flex flex-col min-h-0 shadow-lg shadow-black/20'>
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