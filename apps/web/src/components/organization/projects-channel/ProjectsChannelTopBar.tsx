import DesignButton from "@/components/buttons/DesignButton";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import CreateTaskForm from "@/components/form/taskForm/CreateTaskForm";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChannelType, TaskAssigneeType } from "types/types";
import ProjectChatRenderer from "./ProjectChatRenderer";
import { MdChat } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import ProjectOptionMenu from "@/components/ui/ProjectOptionMenu";
import { useProjectPermission } from "@/hooks/useProjectPermission";
import { useWebSocket } from "@/hooks/useWebsocket";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { projectChannelMessageAtom } from "@/recoil/atoms/organizationAtoms/projectChannelMessageAtom";
import CreateProjectsForm from "@/components/form/CreateProjectsForm";
import { CgMathPlus } from "react-icons/cg";
import GuardComponent from "@/rbac/GuardComponent";
import { Action, Subject } from "types/permission";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectsChannelTopBarProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsChannelTopBarProps) {
    const [projectSideBar, setProjectSideBar] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);
    const [, setUsers] = useState<TaskAssigneeType[]>([]);
    const [openOptionMenuCard, setOpenOptionMenuCard] = useState<boolean>(false);
    const { canView, canManage } = useProjectPermission(selectedProject);
    const [createProjectsModal, setCreateProjectsModal] = useState<boolean>(false);
    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();
    const [, setProjectChannelMessages] = useRecoilState(projectChannelMessageAtom);
    const organizationId = useRecoilValue(organizationIdAtom);

    useEffect(() => {
        if (channel.id && organizationId) {

            subscribeToBackend(channel.id, organizationId, 'new-project');
            subscribeToBackend(channel.id, organizationId, 'project-member-change');
            const unsubscribeNewProjectHandler = subscribeToHandler('new-project', incomingNewProjectHandler);
            const ubsubscribeProjectMemberChangeHandler = subscribeToHandler('project-member-change', projectMemberChangeHandler)

            return () => {
                unsubscribeNewProjectHandler();
                ubsubscribeProjectMemberChangeHandler();
                unsubscribeFromBackend(channel.id, organizationId, 'new-project');
                unsubscribeFromBackend(channel.id, organizationId, 'project-member-change');
            }
        }
    }, [channel.id, organizationId]);

    useEffect(() => {
        if (selectedProject) {
            const allUsers = selectedProject.tasks?.flatMap((task) =>
                (task.assignees || []).filter(assignee => assignee && assignee.project_member.organization_user)
            );
            setUsers(allUsers || []);
        }
    }, [selectedProject]);

    function backHandler() {
        setSelectedProject(null);
    }

    function createTaskHandler() {
        setCreateTaskModal(prev => !prev);
    }

    function incomingNewProjectHandler(newMessage: any) {
        setProjectChannelMessages(prev => [newMessage, ...prev]);
    }

    function projectMemberChangeHandler() {
    }


    return (
        <div className="flex flex-row justify-between w-full">
            {selectedProject ? (
                <DashboardComponentHeading description={selectedProject.description!}>{selectedProject.title}</DashboardComponentHeading>
            ) : (
                <>
                    <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
                    <GuardComponent subject={Subject.PROJECT} action={Action.CREATE} >
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            variant={"outline"}
                            onClick={() => setCreateProjectsModal(true)}>
                            <CgMathPlus size={16} />
                            Add Project
                        </Button>
                    </GuardComponent>
                    {createProjectsModal && <CreateProjectsForm channel={channel} className='w-[30%]' open={createProjectsModal} setOpen={setCreateProjectsModal} />}
                </>
            )}
            {
                selectedProject && (
                    <div className="flex items-center justify-center gap-x-3 relative">
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            variant={"outline"}
                            onClick={backHandler} ><IoChevronBackOutline />Back</Button>
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            variant={"outline"}
                            disabled={!canView} onClick={() => setProjectSideBar(true)}>  <MdChat className="transform scale-x-[-1]" /> Chat</Button>
                        {canManage && <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            variant={"outline"}
                            onClick={createTaskHandler}>
                            <Plus />
                            <span>Add Task</span>
                        </Button>}
                        <BsThreeDotsVertical onClick={() => setOpenOptionMenuCard(true)} className="text-neutral-300 mt-1.5" />
                        <ProjectOptionMenu isAdmin={canManage} open={openOptionMenuCard} setOpen={setOpenOptionMenuCard} />

                        <ProjectChatRenderer channel={channel} open={projectSideBar} setOpen={setProjectSideBar} project={selectedProject} />
                        {createTaskModal && <CreateTaskForm channel={channel} open={createTaskModal} setOpen={setCreateTaskModal} />}
                    </div>
                )
            }
        </div>
    )
}