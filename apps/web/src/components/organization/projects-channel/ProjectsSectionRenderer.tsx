import { useDebugValue, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CreateProjectsForm from '@/components/form/CreateProjectsForm';
import { ChannelType, OrganizationUsersType, ProjectTypes, TaskStatus, TaskTypes } from 'types/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectChannelMessageAtom } from '@/recoil/atoms/organizationAtoms/projectChannelMessageAtom';
import Project from './Project';
import KanBanBoard from './KanBanBoard';
import { projectSelectedAtom } from '@/recoil/atoms/projects/projectSelectedAtom';
import { useWebSocket } from '@/hooks/useWebsocket';
import { organizationIdAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

interface ProjectsProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
    const [createProjectsModal, setCreateProjectsModal] = useState<boolean>(false);
    const [projectsChannelMessages, setProjectChannelMessages] = useRecoilState(projectChannelMessageAtom);
    const organizationId = useRecoilValue(organizationIdAtom);

    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const taskId = active.id.toString();
        const newStatus = over.id.toString() as TaskStatus;

        console.log("task id is : ", taskId);
        console.log("newStatus is : ", newStatus);

        if (selectedProject) {
            console.log("selected project is true");
            const updatedTasks = selectedProject.tasks?.map((task: TaskTypes) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        status: newStatus
                    }
                }
                return task;
            })
            console.log("task ti update is : ", updatedTasks);

            setSelectedProject((prev): ProjectTypes | null => {
                if (!prev) return null;
                return {
                    ...prev,
                    tasks: updatedTasks
                };
            });
        }
    }


    function incomingNewTasksHandler(newMessage: TaskTypes) {
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

    function incomingNewAssigneeHandler(newMessage: any) {
        const { project_id, task_id, org_user_id, action, assignee } = newMessage;
        console.log("new message recieved : ", newMessage);
        // Update projects in the channel messages
        setProjectChannelMessages((prev: ProjectTypes[]) => prev.map((project: ProjectTypes) => {
            if (project.id === project_id) {
                const updatedTasks = project.tasks?.map(task => {
                    if (task.id === task_id) {
                        if (action === 'add' && assignee) {
                            // Make sure assignee has the organization_user property
                            if (!task.assignees?.some(a => a.org_user_id === org_user_id)) {
                                return {
                                    ...task,
                                    assignees: [
                                        ...(task.assignees || []),
                                        assignee // The complete assignee object from the backend
                                    ]
                                };
                            }
                        } else if (action === 'remove') {
                            return {
                                ...task,
                                assignees: task.assignees?.filter(a => a.org_user_id !== org_user_id) || []
                            };
                        }
                    }
                    return task;
                });

                return {
                    ...project,
                    tasks: updatedTasks
                };
            }
            return project;
        }));

        // Also update the selectedProject if it's the one being modified
        setSelectedProject((prev) => {
            if (prev && prev.id === project_id) {
                const updatedTasks = prev.tasks?.map(task => {
                    if (task.id === task_id) {
                        if (action === 'add' && assignee) {
                            // Make sure assignee has the organization_user property
                            if (!task.assignees?.some(a => a.org_user_id === org_user_id)) {
                                return {
                                    ...task,
                                    assignees: [
                                        ...(task.assignees || []),
                                        assignee // The complete assignee object from the backend
                                    ]
                                };
                            }
                        } else if (action === 'remove') {
                            return {
                                ...task,
                                assignees: task.assignees?.filter(a => a.org_user_id !== org_user_id) || []
                            };
                        }
                    }
                    return task;
                });

                return {
                    ...prev,
                    tasks: updatedTasks
                };
            }
            return prev;
        });
    }

    useEffect(() => {
        if (channel.id && organizationId) {
            subscribeToBackend(channel.id, organizationId, 'new-created-task');
            subscribeToBackend(channel.id, organizationId, 'task-assignee-change');
            const unsubscribeNewAssigneeHandler = subscribeToHandler('task-assignee-change', incomingNewAssigneeHandler);
            const unsubscribeNewCreatedTas = subscribeToHandler('new-created-task', incomingNewTasksHandler)

            return () => {
                unsubscribeNewCreatedTas();
                unsubscribeNewAssigneeHandler();
                unsubscribeFromBackend(channel.id, organizationId, 'new-created-task');
                unsubscribeFromBackend(channel.id, organizationId, 'task-assignee-change');
            }
        }
    }, [channel.id, organizationId]);

    return (
        <DndContext onDragEnd={handleDragEnd}>
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
                        <KanBanBoard channel={channel} tasks={selectedProject.tasks!} />
                    )
                }
            </div>
        </DndContext>
    );
}
