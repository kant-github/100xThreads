import { Dispatch, SetStateAction } from "react";
import { ProjectTypes } from "types"

interface ProjectProps {
    project: ProjectTypes;
    setSelectedProject: Dispatch<SetStateAction<ProjectTypes | null>>;
}

export default function ({ project, setSelectedProject }: ProjectProps) {
    return (
        <div key={project.id} onClick={() => setSelectedProject(project)} className="bg-white dark:bg-neutral-800 hover:dark:bg-neutral-800/80 rounded-[14px] p-4 cursor-pointer hover:shadow-lg transition-shadow border dark:border-neutral-700">
            <h3 className="text-lg text-gray-600 dark:text-neutral-200 font-semibold tracking-wider mb-2">{project.title}</h3>
            <p className="text-[13px] text-gray-600 dark:text-neutral-200 tracking-wider">{project.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-amber-500 tracking-wider">
                    {project?.tasks?.length} tasks
                </span>
                <button type='button' className="text-blue-500 hover:text-blue-600 text-[13px] tracking-wider">
                    View Tasks →
                </button>
            </div>
        </div>
    )
}