import DesignButton from "@/components/buttons/DesignButton";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import CreateTaskForm from "@/components/form/taskForm/CreateTaskForm";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { ChannelType, OrganizationUsersType, TaskAssigneeType } from "types/types";
import ProjectChatRenderer from "./ProjectChatRenderer";
import { projectChatSideBar } from "@/recoil/atoms/projects/projectChatSideBar";
import { MdChat } from "react-icons/md";
import { AnimatedTooltipPreview } from "@/components/utility/AnimatedTooltipPreview";


interface ProjectsChannelTopBarProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsChannelTopBarProps) {
    const [projectSideBar, setProjectSideBar] = useRecoilState(projectChatSideBar);
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);
    const [users, setUsers] = useState<TaskAssigneeType[]>([]);

    useEffect(() => {
        if (selectedProject) {
            const allUsers = selectedProject.tasks?.flatMap((task) => task.assignees || []);
            console.log("all users are : ", allUsers);
            setUsers(allUsers || []);
        }
    }, [selectedProject]);

    const uniqueUsers: OrganizationUsersType[] = users
        .map((user) => user.organization_user)
        .filter((value, index, self) =>
            index === self.findIndex((u) => u.user_id === value.user_id)
        );

    function backHandler() {
        setSelectedProject(null);
    }

    function createTaskHandler() {
        setCreateTaskModal(prev => !prev);
    }

    return (
        <div className="flex flex-row justify-between w-full">
            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
            {
                selectedProject && (
                    <div className="flex items-center justify-center gap-x-3 relative">
                        <DesignButton onClick={backHandler} ><IoChevronBackOutline />Back</DesignButton>
                        <DesignButton onClick={() => setProjectSideBar(true)}> <MdChat className="transform scale-x-[-1]" /> Chat</DesignButton>
                        <DesignButton className={"whitespace-nowrap"} onClick={createTaskHandler}>Add Task</DesignButton>
                        <AnimatedTooltipPreview users={uniqueUsers} className="mr-6 mt-1" />

                        <ProjectChatRenderer channel={channel} open={projectSideBar} setOpen={setProjectSideBar} project={selectedProject} />
                        {createTaskModal && <CreateTaskForm channel={channel} open={createTaskModal} setOpen={setCreateTaskModal} />}
                    </div>
                )
            }
        </div>
    )
}