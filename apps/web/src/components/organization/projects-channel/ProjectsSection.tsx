import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CreateProjectsForm from '@/components/form/CreateProjectsForm';
import { ChannelType, ProjectTypes, TaskTypes } from 'types/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectChannelMessageAtom } from '@/recoil/atoms/organizationAtoms/projectChannelMessageAtom';
import Project from './Project';
import KanBanBoard from './KanBanBoard';
import { projectSelectedAtom } from '@/recoil/atoms/projects/projectSelectedAtom';
import { useWebSocket } from '@/hooks/useWebsocket';
import { organizationIdAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';

interface ProjectsProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createProjectsModal, setCreateProjectsModal] = useState<boolean>(false);
    const [projectsChannelMessages, setProjectChannelMessages] = useRecoilState(projectChannelMessageAtom);
    const organizationId = useRecoilValue(organizationIdAtom);

    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();

    function incomingNewTasksHandler(newMessage: TaskTypes) {
        
        console.log("new task is : ", newMessage);

        setProjectChannelMessages((prev: ProjectTypes[]) => prev.map((project) => {
            if (project.id === newMessage.project_id) {
                return {
                    ...project,
                    tasks: [newMessage, ...(project.tasks || [])]
                };
            }
            return project;
        }));

        setSelectedProject((prev) => {
            if (prev && prev.id === newMessage.project_id) {
                return {
                    ...prev,
                    tasks: [newMessage, ...(prev.tasks || [])]
                };
            }
            return prev;
        });
    }

    useEffect(() => {
        if (channel.id && organizationId) {
            subscribeToBackend(channel.id, organizationId, 'new-created-task');
            const unsubscribeNewCreatedTas = subscribeToHandler('new-created-task', incomingNewTasksHandler)
            return () => {
                unsubscribeNewCreatedTas();
                unsubscribeFromBackend(channel.id, organizationId, 'new-created-task');
            }
        }
    }, [channel.id, organizationId]);

    return (
        <div className='w-full px-2 flex flex-col flex-1 min-h-0'>
            <div className="border-b-[0.5px] border-neutral-600 my-6" />
            {
                !selectedProject ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button type='button' onClick={() => setCreateProjectsModal(true)} className="bg-gray-50 dark:bg-neutral-800 rounded-[14px] p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:dark:bg-neutral-800/80 border dark:border-neutral-700 relative">
                            <Plus className="w-5 h-5 text-neutral-200" />
                            <span className="ml-2 text-gray-600 dark:text-neutral-200 mb-[0.5px] text-sm">New Project</span>
                        </button>
                        {projectsChannelMessages.map((project) => (
                            <Project channel={channel} key={project.id} project={project} setSelectedProject={setSelectedProject} />
                        ))}
                        {createProjectsModal && <CreateProjectsForm channel={channel} className='w-[30%]' open={createProjectsModal} setOpen={setCreateProjectsModal} />}
                    </div>
                ) : (
                    <KanBanBoard tasks={selectedProject.tasks!} />
                )
            }
        </div>
    );
}
