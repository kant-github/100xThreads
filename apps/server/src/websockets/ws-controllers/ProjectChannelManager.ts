import Redis from "ioredis";
import { PrismaClient } from ".prisma/client";
import { ChannelSubscription, WebSocketMessage } from "../webSocketServer";

export default class ProjectChannelManager {
    public prisma: PrismaClient;
    public publisher: Redis;

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
    }

    public async projectChatTypingEventHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })
        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: tokenData.userId,
        }))
    }

    public async newProjectCreationHandler(message: WebSocketMessage, tokenData: any) {

        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        const project = await this.prisma.project.create({
            data: {
                creator_id: message.payload.organizationUser.id,
                channel_id: message.payload.channelId!,
                title: message.payload.title,
                description: message.payload.description,
                due_date: new Date(message.payload.dueDate)
            },
            include: {
                tasks: true
            }
        })

        await this.prisma.projectMember.create({
            data: {
                project_id: project.id,
                org_user_id: message.payload.organizationUser.id,
                role: 'ADMIN'
            }
        })

        await this.publisher.publish(channelKey, JSON.stringify({
            type: message.type,
            payload: project
        }))
    }

    public async insertProjectChannelMessage(message: WebSocketMessage, tokenData: any) {

        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        await this.prisma.projectChat.create({
            data: {
                id: message.payload.id,
                project_id: message.payload.project_id,
                organization_id: message.payload.organization_user.organization_id,
                user_id: Number(tokenData.userId),
                message: message.payload.message,
                name: message.payload.name,
            }
        })

        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: tokenData.userId,
            timeStamp: Date.now()
        }))

    }

    public async projectChannelEditMessageHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })


        const currentUSerMEssageCheck = await this.prisma.projectChat.findUnique({
            where: { id: message.payload.messageId },
            include: {
                organization_user: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (Number(currentUSerMEssageCheck?.organization_user.user.id) === Number(tokenData.userId)) {
            const messageData = await this.prisma.chats.update({
                where: { id: message.payload.messageId },
                data: {
                    is_edited: true,
                    edited_at: new Date(),
                    message: message.payload.message
                }
            })

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: messageData,
                type: message.type
            }))
        }
    }

    public async newTaskCreationHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        });

        console.log("incoming message is : ", message);


        const activityLogchannelKey = `${tokenData.organizationId}:${message.payload.channelId}:project-channel-chat-messages`

        // First create the task without assignees
        const task = await this.prisma.tasks.create({
            data: {
                project_id: message.payload.projectId,
                title: message.payload.title,
                description: message.payload.description,
                tags: message.payload.tags,
                color: message.payload.color,
                priority: message.payload.priority,
                due_date: message.payload.dueDate ? new Date(message.payload.dueDate) : null,
                status: message.payload.status,
            },
        });

        const project = await this.prisma.project.findUnique({
            where: {
                id: message.payload.projectId
            },
            select: { title: true }
        })


        const orgUser = await this.prisma.organizationUsers.findUnique({
            where: {
                organization_id_user_id: {
                    organization_id: tokenData.organizationId,
                    user_id: Number(tokenData.userId)
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })

        console.log("org user is : ", orgUser);
        console.log("token data : ", tokenData);

        const chat = await this.prisma.projectChat.create({
            data: {
                project_id: message.payload.projectId,
                organization_id: tokenData.organizationId,
                user_id: Number(tokenData.userId),
                name: 'SYSTEM-PROMPTED',
                message: `Task "${task.title}" was created by "${orgUser?.user.name}"`,
                is_activity: true,
                activity_type: 'TASK_CREATED',
                activity_data: {
                    taskId: task.id,
                    taskTitle: task.title,
                    createdBy: tokenData.userId,
                    priority: task.priority,
                    status: task.status
                }
            }
        })

        console.log("chat is : ", chat);




        await this.publisher.publish(activityLogchannelKey, JSON.stringify({
            type: 'project-channel-chat-messages',
            payload: chat
        }));



        // Then for each assignee, find or create their project member record
        // and create the task assignee relationship
        const assigneeNames = [];
        if (message.payload.assignees && message.payload.assignees.length > 0) {
            for (const assigneeId of message.payload.assignees) {

                // Find or create project member
                let projectMember = await this.prisma.projectMember.findUnique({
                    where: {
                        project_id_org_user_id: {
                            project_id: message.payload.projectId,
                            org_user_id: assigneeId
                        }
                    },
                    include: {
                        organization_user: {
                            include: {
                                user: true
                            }
                        }
                    }
                });

                // If user is not a project member yet, add them
                if (!projectMember) {
                    projectMember = await this.prisma.projectMember.create({
                        data: {
                            project_id: message.payload.projectId,
                            org_user_id: assigneeId,
                            role: 'MEMBER'
                        },
                        include: {
                            organization_user: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    });

                    const newProjectMemberActivity = await this.prisma.projectChat.create({
                        data: {
                            project_id: message.payload.projectId,
                            organization_id: tokenData.organizationId,
                            user_id: Number(tokenData.userId),
                            name: "SYSTEM-PROMPT",
                            message: `${projectMember.organization_user.user.name} has been added to the project`,
                            is_activity: true,
                            activity_type: 'MEMBER_ADDED',
                            related_user_id: projectMember.organization_user.user_id
                        }
                    })


                    await this.publisher.publish(activityLogchannelKey, JSON.stringify({
                        type: 'project-channel-chat-messages',
                        payload: newProjectMemberActivity
                    }));
                }

                // Create activity for new member


                // Create task assignee relationship
                await this.prisma.taskAssignees.create({
                    data: {
                        task_id: task.id,
                        project_member_id: projectMember.id
                    }
                });

                assigneeNames.push(projectMember.organization_user.user.name);
            }

            if (assigneeNames.length > 0) {
                const assignMessage = assigneeNames.length === 1
                    ? `Task "${task.title}" was assigned to ${assigneeNames[0]}`
                    : `Task "${task.title}" was assigned to ${assigneeNames.join(', ')}`;


                const newAssigneeActivity = await this.prisma.projectChat.create({
                    data: {
                        project_id: message.payload.projectId,
                        organization_id: tokenData.organizationId,
                        user_id: Number(tokenData.userId),
                        name: "System",
                        message: assignMessage,
                        is_activity: true,
                        activity_type: 'TASK_ASSIGNED',
                        activity_data: {
                            taskId: task.id,
                            taskTitle: task.title,
                            assigneeIds: message.payload.assignees
                        }
                    }
                });


                await this.publisher.publish(activityLogchannelKey, JSON.stringify({
                    type: 'project-channel-chat-messages',
                    payload: newAssigneeActivity
                }));
            }
        }



        // Fetch the updated task with all relationships
        const updatedTask = await this.prisma.tasks.findUnique({
            where: { id: task.id },
            include: {
                assignees: {
                    include: {
                        project_member: {
                            include: {
                                organization_user: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        await this.publisher.publish(channelKey, JSON.stringify({
            type: message.type,
            payload: updatedTask
        }));
    }

    public async taskAssigneeChangeHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        });

        let assignee;
        if (message.payload.action === 'add') {
            // First check if the user is a member of the project
            const projectMember = await this.prisma.projectMember.findUnique({
                where: {
                    project_id_org_user_id: {
                        project_id: message.payload.project_id,
                        org_user_id: Number(message.payload.orgUserId)
                    }
                }
            });

            // If not a project member, add them as a member with the default role (MEMBER)
            let projectMemberId;
            if (!projectMember) {
                const newProjectMember = await this.prisma.projectMember.create({
                    data: {
                        project_id: message.payload.project_id,
                        org_user_id: Number(message.payload.orgUserId),
                        role: 'MEMBER', // Default role
                    }
                });
                projectMemberId = newProjectMember.id;
            } else {
                projectMemberId = projectMember.id;
            }

            // Check if the task assignee already exists

            const existingAssignee = await this.prisma.taskAssignees.findUnique({
                where: {
                    task_id_project_member_id: {
                        task_id: message.payload.task_id,
                        project_member_id: projectMemberId
                    }
                }
            });


            // Only create if the assignee doesn't already exist
            if (!existingAssignee) {
                assignee = await this.prisma.taskAssignees.create({
                    data: {
                        task_id: message.payload.task_id,
                        project_member_id: projectMemberId,
                    },
                    include: {
                        project_member: {
                            include: {
                                organization_user: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                // If assignee already exists, just fetch the data to return
                assignee = await this.prisma.taskAssignees.findUnique({
                    where: {
                        task_id_project_member_id: {
                            task_id: message.payload.task_id,
                            project_member_id: projectMemberId
                        }
                    },
                    include: {
                        project_member: {
                            include: {
                                organization_user: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
        } else if (message.payload.action === 'remove') {
            // First get the project member ID
            const projectMember = await this.prisma.projectMember.findUnique({
                where: {
                    project_id_org_user_id: {
                        project_id: message.payload.project_id,
                        org_user_id: Number(message.payload.orgUserId)
                    }
                }
            });

            if (projectMember) {
                // Check if the assignee exists before trying to delete
                const existingAssignee = await this.prisma.taskAssignees.findUnique({
                    where: {
                        task_id_project_member_id: {
                            task_id: message.payload.task_id,
                            project_member_id: projectMember.id
                        }
                    }
                });

                if (existingAssignee) {
                    await this.prisma.taskAssignees.delete({
                        where: {
                            task_id_project_member_id: {
                                task_id: message.payload.task_id,
                                project_member_id: projectMember.id
                            }
                        }
                    });
                }
            }
        }

        await this.publisher.publish(channelKey, JSON.stringify({
            type: message.type,
            payload: {
                project_id: message.payload.project_id,
                task_id: message.payload.task_id,
                org_user_id: message.payload.orgUserId,
                action: message.payload.action,
                assignee: assignee
            }
        }));
    }

    public getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }
}