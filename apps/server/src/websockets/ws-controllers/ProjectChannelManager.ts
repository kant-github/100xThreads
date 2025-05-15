import Redis from "ioredis";
import { PrismaClient, ProjectMemberRole } from ".prisma/client";
import { ChannelSubscription, WebSocketMessage } from "../webSocketServer";
import KafkaProducer from "../../kafka/KafkaProducer";
import { NotificationType } from "../types";

export default class ProjectChannelManager {
    public prisma: PrismaClient;
    public publisher: Redis;
    public kafkaProducer: KafkaProducer;
    constructor(prisma: PrismaClient, publisher: Redis, kafkaProducer: KafkaProducer) {
        this.prisma = prisma;
        this.publisher = publisher;
        this.kafkaProducer = kafkaProducer
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

        const createdProject = await this.prisma.project.create({
            data: {
                creator_id: message.payload.organizationUser.id,
                channel_id: message.payload.channelId!,
                title: message.payload.title,
                description: message.payload.description,
                due_date: new Date(message.payload.dueDate),
                members: {
                    create: {
                        org_user_id: message.payload.organizationUser.id,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                members: {
                    include: {
                        organization_user: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                tasks: {
                    include: {
                        assignees: {
                            include: {
                                project_member: {
                                    include: {
                                        organization_user: {
                                            include: {
                                                user: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });


        await this.publisher.publish(channelKey, JSON.stringify({
            type: message.type,
            payload: createdProject
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

        console.log("hitted ------------------------------------------------- >");

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
            select: { title: true, id: true }
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
                        id: true,
                        image: true
                    }
                },
                organization: true
            }
        })


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


        await this.publisher.publish(activityLogchannelKey, JSON.stringify({
            type: 'project-channel-chat-messages',
            payload: chat
        }));



        const assigneeNames = [];
        if (message.payload.assignees && message.payload.assignees.length > 0) {
            for (const assigneeId of message.payload.assignees) {

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

                    // ---------------------------------------- >

                    const notificationData: NotificationType = {
                        user_id: projectMember.organization_user.user_id,
                        type: 'PROJECT_MEMBER_ADDED',
                        title: 'Project Member',
                        message: `📽️ You are added to the project '${project}' posted in '${orgUser?.organization.name}'`,
                        created_at: Date.now().toString(),
                        sender_id: Number(message.payload.userId),
                        reference_id: project?.id,
                        metadata: {
                            image: orgUser?.user.image || ''
                        }
                    };
                    console.log("notification data to send to kafka stream : ", notificationData);

                    this.kafkaProducer.sendMessage('notifications', notificationData, projectMember.org_user_id);

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
            const projectMember = await this.prisma.projectMember.findUnique({
                where: {
                    project_id_org_user_id: {
                        project_id: message.payload.project_id,
                        org_user_id: Number(message.payload.orgUserId)
                    }
                }
            });

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


            const existingAssignee = await this.prisma.taskAssignees.findUnique({
                where: {
                    task_id_project_member_id: {
                        task_id: message.payload.task_id,
                        project_member_id: projectMemberId
                    }
                }
            });


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
            const projectMember = await this.prisma.projectMember.findUnique({
                where: {
                    project_id_org_user_id: {
                        project_id: message.payload.project_id,
                        org_user_id: Number(message.payload.orgUserId)
                    }
                }
            });

            if (projectMember) {
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

    public async projectMemberChangeHandler(message: WebSocketMessage, tokenData: any) {
        const { project_id, members, projectName } = message.payload as {
            project_id: string;
            members: { org_user_id: number; role?: string }[];
            projectName: string;
        };

        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        });

        const orgUserIds = members.map(member => member.org_user_id);

        const existingMembers = await this.prisma.projectMember.findMany({
            where: { project_id },
            select: { org_user_id: true }
        });

        const existingIds = new Set(existingMembers.map(m => m.org_user_id));
        const incomingIds = new Set(orgUserIds);
        const toAdd = members.filter(m => !existingIds.has(m.org_user_id));
        const toRemove = [...existingIds].filter(id => !incomingIds.has(id));

        if (toAdd.length > 0) {
            await this.prisma.projectMember.createMany({
                data: toAdd.map(member => ({
                    project_id,
                    org_user_id: member.org_user_id,
                    role: ProjectMemberRole.MEMBER
                })),
                skipDuplicates: true
            });
        }

        if (toRemove.length > 0) {
            await this.prisma.projectMember.deleteMany({
                where: {
                    project_id,
                    org_user_id: { in: toRemove }
                }
            });
        }

        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            timeStamp: Date.now()
        }));

        const affectedOrgUserIds = [...new Set([
            ...toAdd.map(m => m.org_user_id),
            ...toRemove
        ])];

        if (affectedOrgUserIds.length === 0) return;

        const affectedUsers = await this.prisma.organizationUsers.findMany({
            where: {
                user_id: { in: affectedOrgUserIds }
            },
            include: {
                user: true,
                organization: true
            }
        });

        for (const member of toAdd) {
            const orgUser = affectedUsers.find(u => u.user_id === member.org_user_id);
            if (!orgUser) continue;

            const notificationData: NotificationType = {
                user_id: orgUser.user_id,
                type: 'PROJECT_MEMBER_ADDED',
                title: 'Project Member',
                message: `📽️ You are added to the project '${projectName}' posted in '${orgUser.organization.name}'`,
                created_at: Date.now().toString(),
                sender_id: Number(message.payload.userId),
                reference_id: project_id,
                metadata: {
                    image: orgUser.user?.image || ''
                }
            };

            this.kafkaProducer.sendMessage('notifications', notificationData, orgUser.user_id);
        }

        // (Optional) Notify removed users
        // for (const removedId of toRemove) {
        //     const orgUser = affectedUsers.find(u => u.user_id === removedId);
        //     if (!orgUser) continue;

        //     const notificationData: NotificationType = {
        //         user_id: orgUser.user_id,
        //         type: 'PROJECT_REMOVED',
        //         title: 'Project Member',
        //         message: `🚫 You were removed from the project ${projectName} in ${orgUser.organization.name}`,
        //         created_at: Date.now().toString(),
        //         sender_id: Number(message.payload.userId),
        //         reference_id: project_id,
        //         metadata: {
        //             image: orgUser.user?.image || ''
        //         }
        //     };

        //     this.kafkaProducer.sendMessage('notifications', notificationData, orgUser.user_id);
        // }
    }

    public getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }
}