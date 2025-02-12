import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateProjectsForm from '@/components/form/CreateProjectsForm';
import { ChannelType, ProjectTypes } from 'types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectChannelMessageAtom } from '@/recoil/atoms/organizationAtoms/projectChannelMessageAtom';
import Project from './Project';

interface ProjectsProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useState<ProjectTypes | null>(null);
    const [createProjectsModal, setCreateProjectsModal] = useState<boolean>(false);
    const projectsChannelMessages = useRecoilValue(projectChannelMessageAtom);

    return (
        <div className='w-full'>
            {
                !selectedProject ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectsChannelMessages.map((project) => (
                            <Project project={project} setSelectedProject={setSelectedProject} />
                        ))}

                        <button type='button' onClick={() => setCreateProjectsModal(true)} className="bg-gray-50 dark:bg-neutral-700 rounded-[14px] p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-600 relative">
                            <Plus className="w-6 h-6 text-gray-400" />
                            <span className="ml-2 text-gray-600 dark:text-gray-300">New Project</span>
                        </button>
                        {createProjectsModal && <CreateProjectsForm channel={channel} className='w-[50%]' open={createProjectsModal} setOpen={setCreateProjectsModal} />}
                    </div>
                ) : (
                    selectedProject.tasks?.map((task) => (
                        <div>{task.title}</div>
                    ))
                )
            }
        </div>
    );
}