import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { ChannelType } from "types";
import ProjectsMessages from "../projects-channel/ProjectsMessages";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useEffect } from "react";
import { projectChannelMessageAtom } from "@/recoil/atoms/organizationAtoms/projectChannelMessageAtom";

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
            console.log(data);
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
            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
            <UtilityCard className="p-8 w-full flex-1 mt-4 dark:bg-neutral-800 flex flex-col min-h-0">
                <ProjectsMessages channel={channel} />
            </UtilityCard>
        </div>
    );
}