import { useEffect, useState } from "react";
import { ChannelType } from "types/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom, organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessagesAtom";
import AnnouncementChannelTopBar from "../announcement-channel/AnnouncementChannelTopBar";
import { useWebSocket } from "@/hooks/useWebsocket";
import AnnouncementChannelREnderer from "../announcement-channel/AnnouncementChannelRenderer";

interface RegularChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: RegularChannelViewProps) {
    const session = useRecoilValue(userSessionAtom);
    const setAnnouncementChannelMessages = useSetRecoilState(announcementChannelMessgaes);
    const organization = useRecoilValue(organizationAtom);
    
    const [createAnnoucementModal, setCreateAnnouncementModal] = useState<boolean>(false);
    const organizationId = useRecoilValue(organizationIdAtom);
    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();

    function handleIncomingAnnouncemennts(newMessage: any) {
        console.log(newMessage);
    }

    async function getWelcomeMessages() {
        try {
            const data = await axios.get(`${API_URL}/organizations/${organization?.id}/channels/${channel.id}/announcement-channel`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                }
            })
            if (data.data.data) {
                setAnnouncementChannelMessages(data.data.data)
            }
        } catch (err) {
            console.log("Error in fetching the welcome channel messages");
        }

    }

    useEffect(() => {
        getWelcomeMessages();
    }, [])
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <AnnouncementChannelTopBar createAnnoucementModal={createAnnoucementModal} setCreateAnnouncementModal={setCreateAnnouncementModal} channel={channel} />
            <AnnouncementChannelREnderer setCreateAnnouncementModal={setCreateAnnouncementModal} channel={channel} />
        </div>
    );
}


