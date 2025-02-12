import { Dispatch, SetStateAction } from "react";
import { ProjectTypes } from "types"

interface ProjectProps {
    project: ProjectTypes;
    setSelectedProject: Dispatch<SetStateAction<ProjectTypes | null>>;
}

export default function ({ project, setSelectedProject }: ProjectProps) {
    return (
        <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white dark:bg-neutral-700 rounded-[14px] p-4 cursor-pointer hover:shadow-lg transition-shadow">
            <h3 className="text-lg text-gray-600 dark:text-neutral-300 font-semibold mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 dark:text-neutral-300">{project.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {project?.tasks?.length} tasks
                </span>
                <button type='button' className="text-blue-500 hover:text-blue-600">
                    View Tasks →
                </button>
            </div>
        </div>
    )
}