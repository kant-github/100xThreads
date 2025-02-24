import DesignButton from "@/components/buttons/DesignButton";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import CreateTaskForm from "@/components/form/taskForm/CreateTaskForm";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { ChannelType } from "types/types";

interface ProjectsChannelTopBarProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsChannelTopBarProps) {

    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);

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
                        <DesignButton onClick={createTaskHandler}>Add Task</DesignButton>
                        {createTaskModal && <CreateTaskForm channel={channel} open={createTaskModal} setOpen={setCreateTaskModal} />}
                    </div>
                )
            }
        </div>
    )
}