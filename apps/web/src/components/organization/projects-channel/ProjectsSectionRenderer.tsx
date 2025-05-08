import { useEffect } from 'react';
import { ChannelType, ProjectTypes, TaskStatus, TaskTypes } from 'types/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectChannelMessageAtom } from '@/recoil/atoms/organizationAtoms/projectChannelMessageAtom';
import Project from './Project';
import KanBanBoard from './KanBanBoard';
import { projectSelectedAtom } from '@/recoil/atoms/projects/projectSelectedAtom';
import { useWebSocket } from '@/hooks/useWebsocket';
import { organizationIdAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import UtilityCard from '@/components/utility/UtilityCard';

interface ProjectsProps {
    channel: ChannelType;
}

export default function ({ channel }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useRecoilState(projectSelectedAtom);
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
        setProjectChannelMessages((prev: ProjectTypes[]) => prev.map((project: ProjectTypes) => {
            if (project.id === project_id) {
                const updatedTasks = project.tasks?.map(task => {
                    if (task.id === task_id) {
                        if (action === 'add' && assignee) {
                            // Make sure assignee has the organization_user property
                            if (!task.assignees?.some(a => a.project_member.org_user_id === org_user_id)) {
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
                                assignees: task.assignees?.filter(a => a.project_member.org_user_id !== org_user_id) || []
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
                            if (!task.assignees?.some(a => a.project_member.org_user_id === org_user_id)) {
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
                                assignees: task.assignees?.filter(a => a.project_member.org_user_id !== org_user_id) || []
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
            const unsubscribeNewCreatedTask = subscribeToHandler('new-created-task', incomingNewTasksHandler)

            return () => {
                unsubscribeNewCreatedTask();
                unsubscribeNewAssigneeHandler();
                unsubscribeFromBackend(channel.id, organizationId, 'new-created-task');
                unsubscribeFromBackend(channel.id, organizationId, 'task-assignee-change');
            }
        }
    }, [channel.id, organizationId]);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className='w-full flex flex-col flex-1 min-h-0'>
                {
                    !selectedProject ? (
                        <UtilityCard className='p-8 w-full flex-1 mt-4 dark:bg-neutral-800 gap-y-4 min-h-0 shadow-lg shadow-black/20 grid grid-cols-1 md:grid-cols-2'>
                            {projectsChannelMessages.map((project) => (
                                <Project channel={channel} key={project.id} project={project} setSelectedProject={setSelectedProject} />
                            ))}
                        </UtilityCard>
                    ) : (
                        <KanBanBoard channel={channel} tasks={selectedProject.tasks!} />
                    )
                }
            </div>
        </DndContext>
    );
}
