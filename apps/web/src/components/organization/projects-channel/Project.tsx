import { Dispatch, SetStateAction, useState } from "react";
import { ChannelType, ProjectTypes } from "types/types"
import { LiaTasksSolid } from "react-icons/lia";
import ProjectTimespan from "@/components/utility/ProjectTimespan";
import ProjectTasksTicker from "@/components/utility/tickers/ProjectTasksTicker";
import ProjectChatRenderer from "./ProjectChatRenderer";
import { MdChat } from "react-icons/md";
import { useProjectPermission } from "@/hooks/useProjectPermission";
import { PiChatCenteredSlashFill } from "react-icons/pi";


interface ProjectProps {
    project: ProjectTypes;
    setSelectedProject: Dispatch<SetStateAction<ProjectTypes | null>>;
    channel: ChannelType
}

export default function ({ project, setSelectedProject, channel }: ProjectProps) {
    const [projectSideBar, setProjectSideBar] = useState(false);
    const { canView } = useProjectPermission(project);

    return (
        <div key={project.id} className="flex flex-col items-start bg-white bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-[14px] px-6 py-4 cursor-pointer hover:shadow-lg transition-shadow group relative max-h-48">
            {
                canView ? (
                    <MdChat className="absolute right-4 top-4 text-neutral-200" onClick={(e) => {
                        e.stopPropagation();
                        setProjectSideBar(true);
                    }} size={15} />
                ) : (
                    <PiChatCenteredSlashFill className="absolute right-4 top-4 text-neutral-600 cursor-not-allowed" />
                )
            }
            <h3 className="text-lg text-gray-600 dark:text-neutral-200 font-medium tracking-wider">{project.title}</h3>
            <p className="text-[12px] text-gray-600 dark:text-neutral-200 font-light tracking-wider mt-2">{project.description}</p>
            <ProjectTimespan project={project} />
            <div className="flex flex-row w-full justify-between items-center mt-5">
                <ProjectTasksTicker>
                    <LiaTasksSolid size={14} />
                    {project?.tasks?.length} tasks
                </ProjectTasksTicker>
                {
                    canView && (
                        <button onClick={() => setSelectedProject(project)} type='button' className="text-blue-500 hover:text-blue-600 text-[13px] tracking-wider">
                            View Tasks →
                        </button>
                    )
                }
            </div>
            <ProjectChatRenderer project={project} channel={channel} open={projectSideBar} setOpen={setProjectSideBar} />
        </div>
    )
}