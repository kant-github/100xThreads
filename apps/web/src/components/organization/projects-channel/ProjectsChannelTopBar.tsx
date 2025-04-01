import DesignButton from "@/components/buttons/DesignButton";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import CreateTaskForm from "@/components/form/taskForm/CreateTaskForm";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { ChannelType, OrganizationUsersType, TaskAssigneeType } from "types/types";
import ProjectChatRenderer from "./ProjectChatRenderer";
import { MdChat } from "react-icons/md";
import { AnimatedTooltipPreview } from "@/components/utility/AnimatedTooltipPreview";
import { BsThreeDotsVertical } from "react-icons/bs";
import UtilityOptionMenuCard from "@/components/utility/UtilityOptionMenuCard";
import ProjectOptionMenu from "@/components/ui/ProjectOptionMenu";
import { useProjectPermission } from "@/hooks/useProjectPermission";

interface ProjectsChannelTopBarProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsChannelTopBarProps) {
    const [projectSideBar, setProjectSideBar] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);
    const [users, setUsers] = useState<TaskAssigneeType[]>([]);
    const [openOptionMenuCard, setOpenOptionMenuCard] = useState<boolean>(false);
    const { canView } = useProjectPermission(selectedProject);
    console.log("rn can view is : ", canView);

    useEffect(() => {
        if (selectedProject) {
            const allUsers = selectedProject.tasks?.flatMap((task) =>
                (task.assignees || []).filter(assignee => assignee && assignee.organization_user)
            );
            setUsers(allUsers || []);
        }
    }, [selectedProject]);

    const uniqueUsers: OrganizationUsersType[] = users
        .filter(user => user && user.organization_user) // Ensure organization_user exists
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
            {selectedProject ? (
                <DashboardComponentHeading description={selectedProject.description!}>{selectedProject.title}</DashboardComponentHeading>
            ) : (
                <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
            )}
            {
                selectedProject && (
                    <div className="flex items-center justify-center gap-x-3 relative">
                        <DesignButton onClick={backHandler} ><IoChevronBackOutline />Back</DesignButton>
                        <DesignButton disabled={!canView} onClick={() => setProjectSideBar(true)}>  <MdChat className="transform scale-x-[-1]" /> Chat</DesignButton>
                        <DesignButton className={"whitespace-nowrap"} onClick={createTaskHandler}>Add Task</DesignButton>
                        <BsThreeDotsVertical onClick={() => setOpenOptionMenuCard(true)} className="text-neutral-300 mt-1.5" />
                        <ProjectOptionMenu open={openOptionMenuCard} setOpen={setOpenOptionMenuCard} />

                        <ProjectChatRenderer channel={channel} open={projectSideBar} setOpen={setProjectSideBar} project={selectedProject} />
                        {createTaskModal && <CreateTaskForm channel={channel} open={createTaskModal} setOpen={setCreateTaskModal} />}
                    </div>
                )
            }
        </div>
    )
}