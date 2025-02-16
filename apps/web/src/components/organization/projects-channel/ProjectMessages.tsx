import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilitySideBar from "@/components/utility/UtilitySideBar";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { generalChatsAtom } from "@/recoil/atoms/chats/generalChatsAtom";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChannelType, MessageType, ProjectTypes } from "types";
import ProjectChats from "./ProjectChats";

interface ProjectMessagesProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    project: ProjectTypes;
    channel: ChannelType
}

export default function ({ channel, open, setOpen, project }: ProjectMessagesProps) {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useRecoilState<MessageType[]>(generalChatsAtom);
    const session = useRecoilValue(userSessionAtom);
    const organization = useRecoilValue(organizationAtom);
    let lastCursor: string | null = null;

    useEffect(() => {
        const fetchInitialChats = async () => {
            setLoading(true);
            await new Promise(t => setTimeout(t, 1000));
            try {
                const url = lastCursor ? `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/project/${project.id}/chats?cursor=${lastCursor}&pageSize=50` : `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/chats?pageSize=50`;
                const { data } = await axios.get(url,
                    {
                        headers: {
                            authorization: `Bearer ${session.user?.token}`,
                        }
                    }
                );
                setChats(data.data);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialChats();

        return () => {
            setChats([]);
        };
    }, [channel.id, session.user]);

    return (
        <UtilitySideBar
            width="5/12"
            open={open}
            setOpen={setOpen}
            content={
                <div className="px-4 py-2 h-full flex flex-col">
                    <DashboardComponentHeading className="ml-2 mt-2" description={project.description!}>{project.title}</DashboardComponentHeading>
                    {
                        loading ? <div>loading...</div> : (
                            <ProjectChats chats={chats} open={open} setOpen={setOpen} channel={channel} project={project} />
                        )
                    }
                </div>
            }
        />
    )
}