import { ChannelType } from "types/types";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useEffect } from "react";
import { projectChannelMessageAtom } from "@/recoil/atoms/organizationAtoms/projectChannelMessageAtom";
import ProjectsChannelTopBar from "../projects-channel/ProjectsChannelTopBar";
import ProjectsSectionRenderer from "../projects-channel/ProjectsSectionRenderer";
import { useWebSocket } from "@/hooks/useWebsocket";


interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    const organization = useRecoilValue(organizationAtom);
    const session = useRecoilValue(userSessionAtom);
    const setProjectChannelMessages = useSetRecoilState(projectChannelMessageAtom);
    

    async function getWelcomeMessages() {
        try {
            const { data } = await axios.get(`${API_URL}/organizations/${organization?.id}/channels/${channel.id}/project-channel`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                }
            })
            if (data.data) {
                setProjectChannelMessages(data.data)
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
            <ProjectsChannelTopBar channel={channel} />
            <ProjectsSectionRenderer channel={channel} />
        </div>
    );
}