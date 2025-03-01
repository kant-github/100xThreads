import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilitySideBar from "@/components/utility/UtilitySideBar";
import { API_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChannelType, ProjectChatTypes, ProjectTypes } from "types/types";
import ProjectChats from "./ProjectChats";
import ProjectTasksTicker from "@/components/utility/tickers/ProjectTasksTicker";
import { LiaTasksSolid } from "react-icons/lia";
import { projectChatsAtom } from "@/recoil/atoms/projects/projectChatsAtom";
import Spinner from "@/components/loaders/Spinner";
import UnclickableTicker from "@/components/ui/UnclickableTicker";
import { format } from 'date-fns'
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";

interface ProjectMessagesProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType;
    project: ProjectTypes;
}

export default function ({ channel, open, setOpen, project }: ProjectMessagesProps) {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useRecoilState<ProjectChatTypes[]>(projectChatsAtom);
    const session = useRecoilValue(userSessionAtom);
    const organization = useRecoilValue(organizationAtom);

    let lastCursor: string | null = null;

    if (open) {
        console.log("project is ", project?.title);
    }

    useEffect(() => {
        const SIDEBAR_ANIMATION_DURATION = 300;

        if (open) {
            setLoading(true);
            const timer = setTimeout(() => {
                const fetchInitialChats = async () => {
                    try {
                        const url = `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/project/${project?.id}/chats?pageSize=50`;
                        const { data } = await axios.get(url, {
                            headers: {
                                authorization: `Bearer ${session.user?.token}`,
                            }
                        });
                        console.log("logging things here : ", data.data);
                        setChats(data.data);
                    } catch (error) {
                        console.error('Failed to fetch chats:', error);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchInitialChats();
            }, SIDEBAR_ANIMATION_DURATION);

            return () => {
                clearTimeout(timer);
                setChats([]);
                setLoading(true);
            };
        }
    }, [project?.id, session.user, open]);

    return (
        <UtilitySideBar
            width="5/12"
            open={open}
            setOpen={setOpen}
            content={
                <div className="h-full flex flex-col px-4 py-2 min-w-[300px]">
                    <div className="h-16 flex flex-row justify-between items-center">
                        <DashboardComponentHeading className="ml-2" description={project?.description!}>
                            {project?.title}
                        </DashboardComponentHeading>
                        <div className="flex flex-row items-end gap-x-3">
                            <div>
                                <ProjectTasksTicker>
                                    <LiaTasksSolid size={14} />
                                    {project?.tasks?.length} tasks
                                </ProjectTasksTicker>
                            </div>
                            <UnclickableTicker>
                                Due: {project?.due_date ? format(new Date(project?.due_date), "EEE d MMM") : 'No due date'}
                            </UnclickableTicker>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center relative px-4 py-2 mt-4 rounded-[12px] dark:bg-neutral-800/60">
                                <Spinner />
                            </div>
                        ) : (
                            <ProjectChats
                                chats={chats}
                                open={open}
                                setOpen={setOpen}
                                channel={channel}
                                project={project!}
                            />
                        )}
                    </div>
                </div>
            }
        />
    );
}