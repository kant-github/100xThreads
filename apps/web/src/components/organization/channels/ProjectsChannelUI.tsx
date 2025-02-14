import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { ChannelType } from "types";
import ProjectsMessages from "../projects-channel/ProjectsMessages";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useEffect, useState } from "react";
import { projectChannelMessageAtom } from "@/recoil/atoms/organizationAtoms/projectChannelMessageAtom";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import DesignButton from "@/components/buttons/DesignButton";
import { IoChevronBackOutline } from "react-icons/io5";
import CreateTaskForm from "@/components/form/CreateTaskForm";


interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: WelcomeChannelViewProps) {
    const organization = useRecoilValue(organizationAtom);
    const session = useRecoilValue(userSessionAtom);
    const setProjectChannelMessages = useSetRecoilState(projectChannelMessageAtom);
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);

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

    function backHandler() {
        setSelectedProject(null);
    }

    function createTaskHandler() {
        setCreateTaskModal(prev => !prev);
    }

    useEffect(() => {
        getWelcomeMessages();
    }, [])

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <div className="flex flex-row justify-between w-full">
                <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
                {
                    selectedProject && (
                        <div className="flex items-center justify-center gap-x-3 relative">
                            <DesignButton onClick={backHandler} ><IoChevronBackOutline />Back</DesignButton>
                            <DesignButton onClick={createTaskHandler}>Add Task</DesignButton>
                            {createTaskModal && <CreateTaskForm open={createTaskModal} setOpen={setCreateTaskModal} />}
                        </div>
                    )
                }
            </div>
            <ProjectsMessages channel={channel} />
        </div>
    );
}