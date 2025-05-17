import { useEffect, useState } from "react";
import { ChannelType } from "types/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessagesAtom";
import AnnouncementChannelTopBar from "../announcement-channel/AnnouncementChannelTopBar";
import { useWebSocket } from "@/hooks/useWebsocket";
import AnnouncementChannelREnderer from "../announcement-channel/AnnouncementChannelRenderer";
import AnnouncementSkeleton from "@/components/skeletons/AnnouncementChannelSkeleton";

interface RegularChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: RegularChannelViewProps) {
    const session = useRecoilValue(userSessionAtom);
    const setAnnouncementChannelMessages = useSetRecoilState(announcementChannelMessgaes);
    const organizationId = useRecoilValue(organizationIdAtom);
    const [createAnnoucementModal, setCreateAnnouncementModal] = useState<boolean>(false);
    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();
    const [loading, setLoading] = useState<boolean>(false);

    function handleNewAnnouncement(newMessage: any) {
        setAnnouncementChannelMessages(prev => [newMessage, ...prev]);
    }

    function handleUpdateAnnouncement(updated: any) {
        setAnnouncementChannelMessages(prev =>
            prev.map(item => item.id === updated.id ? updated : item)
        );
    }

    function handleDeleteAnnouncement(deleted: any) {
        setAnnouncementChannelMessages(prev =>
            prev.filter(item => item.id !== deleted.id)
        );
    }

    useEffect(() => {
        if (organizationId && channel.id && session.user?.id) {

            subscribeToBackend(channel.id, organizationId, 'new-announcement')
            subscribeToBackend(channel.id, organizationId, 'update-announcement');
            subscribeToBackend(channel.id, organizationId, 'delete-announcement');

            const unsubNew = subscribeToHandler('new-announcement', handleNewAnnouncement);
            const unsubUpdate = subscribeToHandler('update-announcement', handleUpdateAnnouncement);
            const unsubDelete = subscribeToHandler('delete-announcement', handleDeleteAnnouncement);

            return () => {
                unsubNew();
                unsubUpdate();
                unsubDelete();
                unsubscribeFromBackend(channel.id, organizationId, 'new-announcement');
                unsubscribeFromBackend(channel.id, organizationId, 'update-announcement');
                unsubscribeFromBackend(channel.id, organizationId, 'delete-announcement');
            }
        }
    }, [organizationId, channel.id, session.user?.id])



    async function getWelcomeMessages() {
        try {
            setLoading(true);
            const data = await axios.get(`${API_URL}/organizations/${organizationId}/channels/${channel.id}/announcement-channel`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                }
            })
            if (data.data.data) {
                setAnnouncementChannelMessages(data.data.data)
            }
        } catch (err) {
            console.log("Error in fetching the welcome channel messages");
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        getWelcomeMessages();
    }, [])
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <AnnouncementChannelTopBar createAnnoucementModal={createAnnoucementModal} setCreateAnnouncementModal={setCreateAnnouncementModal} channel={channel} />
            {loading ? <AnnouncementSkeleton /> : (<AnnouncementChannelREnderer setCreateAnnouncementModal={setCreateAnnouncementModal} channel={channel} />)}
        </div>
    );
}


