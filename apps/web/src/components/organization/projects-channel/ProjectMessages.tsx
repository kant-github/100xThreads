import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilitySideBar from "@/components/utility/UtilitySideBar";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChannelType, ProjectChatTypes, ProjectTypes } from "types";
import ProjectChats from "./ProjectChats";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import ProjectTasksTicker from "@/components/utility/tickers/ProjectTasksTicker";
import { LiaTasksSolid } from "react-icons/lia";
import { projectChatsAtom } from "@/recoil/atoms/projects/projectChatsAtom";

interface ProjectMessagesProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    project: ProjectTypes;
    channel: ChannelType
}

export default function ({ channel, open, setOpen, project }: ProjectMessagesProps) {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useRecoilState<ProjectChatTypes[]>(projectChatsAtom);
    const session = useRecoilValue(userSessionAtom);
    const organization = useRecoilValue(organizationAtom);
    let lastCursor: string | null = null;

    useEffect(() => {
        const fetchInitialChats = async () => {
            try {
                const url = lastCursor
                    ? `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/project/${project.id}/chats?cursor=${lastCursor}&pageSize=50`
                    : `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/project/${project.id}/chats?pageSize=50`;
                const { data } = await axios.get(url, {
                    headers: {
                        authorization: `Bearer ${session.user?.token}`,
                    }
                });
                setChats(data.data);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            if (!loading) setLoading(true);
            fetchInitialChats();
        }

        return () => {
            setChats([]);
        };
    }, [project.id, session.user, open]);

    return (
        <UtilitySideBar
            width="5/12"
            open={open}
            setOpen={setOpen}
            content={
                <div className="h-full flex flex-col px-4 py-2 min-w-[300px]">
                    <div className="h-16 flex flex-row justify-between items-center">
                        <DashboardComponentHeading className="ml-2" description={project.description!}>
                            {project.title}
                        </DashboardComponentHeading>
                        <div>
                            <ProjectTasksTicker>
                                <LiaTasksSolid size={14} />
                                {project?.tasks?.length} tasks
                            </ProjectTasksTicker>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        <div className={`absolute inset-0 transition-opacity duration-200 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <ChatSkeleton />
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-200 ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <ProjectChats
                                chats={chats}
                                open={open}
                                setOpen={setOpen}
                                channel={channel}
                                project={project}
                            />
                        </div>
                    </div>
                </div>
            }
        />
    );
}