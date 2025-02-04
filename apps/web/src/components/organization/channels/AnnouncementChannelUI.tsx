import { useEffect, useState } from "react";
import { AnnouncementType, ChannelType } from "types";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import AnnouncementChannelMessages from "../announcement-channel/AnnouncementChannelMessages";

interface RegularChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: RegularChannelViewProps) {
    const session = useRecoilValue(userSessionAtom);
    const [createAnnoucementModal, setCreateAnnouncementModal] = useState<boolean>(false);
    const [announcementData, setAnnouncementData] = useState<AnnouncementType[]>([]);
    const organization = useRecoilValue(organizationAtom);
    async function getWelcomeMessages() {
        try {
            const data = await axios.get(`${API_URL}/organizations/${organization?.id}/channels/${channel.id}/announcement-channel`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                }
            })
            if (data.data.data) {
                setAnnouncementData(data.data.data)
            }
        } catch (err) {
            console.log("Error in fetching the welcome channel messages");
        }

    }

    useEffect(() => {
        getWelcomeMessages();
    }, [])
    return (
        <>
            <AnnouncementChannelMessages channel={channel} announcementData={announcementData} />
        </>
    );
}


