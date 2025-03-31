import { PrismaClient } from ".prisma/client";
import Redis from "ioredis";
import { ChannelSubscription, WebSocketMessage } from "./webSocketServer";

export default class WebSocketDatabaseManager {

    private prisma: PrismaClient;
    private publisher: Redis;
    private static readonly pollInclude = {
        options: {
            include: {
                votes: {
                    select: {
                        id: true,
                        user_id: true,
                        created_at: true
                    }
                }
            }
        },
        creator: {
            select: {
                id: true,
                name: true,
            }
        },
        votes: {
            select: {
                id: true,
                user_id: true,
                option_id: true,
                created_at: true
            }
        }
    } as const;

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
    }

    async handleIncomingMessage(message: WebSocketMessage, tokenData: any) {
        try {
            switch (message.type) {
                case 'insert-general-channel-message':
                    return this.insertGeneralChannelMessage(message, tokenData);
                case 'delete-message':
                    return this.deleteMessageHandler(message, tokenData);
                case 'edit-message':
                    return this.editMessageHandler(message, tokenData);
                case 'typing-event':
                    return this.typingEvent(message, tokenData)
                case 'new-poll':
                    return this.newPollHandler(message, tokenData)
                case 'active-poll':
                    return this.activePollHandler(message, tokenData);
                case 'welcome-user':
                    return this.welcomeUserHandler(message, tokenData);
                case 'new-announcement':
                    return this.announcementHandler(message, tokenData);
                case 'new-project':
                    return this.newProjectCreationHandler(message, tokenData);
                case 'project-channel-chat-messages':
                    return this.insertProjectChannelMessage(message, tokenData);
                case 'project-channel-edit-message':
                    return this.projectChannelEditMessageHandler(message, tokenData);
                case 'project-chat-typing-events':
                    return this.projectChatTypingEventHandler(message, tokenData);
                case 'new-created-task':
                    return this.newTaskCreationHandler(message, tokenData);
                case 'task-assignee-change':
                    return this.taskAssigneeChangeHandler(message, tokenData);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    private async insertGeneralChannelMessage(message: WebSocketMessage, tokenData: any) {
        await this.prisma.chats.create({
            data: {
                id: message.payload.id,
                channel_id: message.payload.channelId,
                organization_id: message.payload.organization_user.organization_id,
                org_user_id: Number(message.payload.org_user_id),
                message: message.payload.message,
                name: message.payload.name,
            }
        })

        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: tokenData.userId,
            timeStamp: Date.now()
        }))
    }

    private async typingEvent(message: WebSocketMessage, tokenData: any) {
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

    private async projectChatTypingEventHandler(message: WebSocketMessage, tokenData: any) {
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

    private async newPollHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })
        const poll = await this.prisma.poll.create({
            data: {
                channel_id: message.payload.channelId,
                question: message.payload.question,
                options: {
                    create: message.payload.options.map((optionText: string) => ({
                        text: optionText
                    }))
                },
                creator_id: Number(message.payload.userId),
                expires_at: this.calculateExpirationTime(message.payload.expiresIn)
            },
            include: WebSocketDatabaseManager.pollInclude
        })

        console.log("new created poll is : ", poll);
        await this.publisher.publish(channelKey, JSON.stringify({
            payload: poll,
            type: message.type
            // userId: tokenData.userId
        }))
    }

    private async activePollHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        try {
            const existingVote = await this.prisma.pollVote.findUnique({
                where: {
                    poll_id_user_id: {
                        poll_id: message.payload.pollId,
                        user_id: Number(message.payload.userId)
                    }
                }
            })

            if (existingVote) {
                await this.prisma.pollVote.update({
                    where: {
                        id: existingVote.id
                    },
                    data: {
                        option_id: message.payload.optionId
                    }
                })
            } else {
                await this.prisma.pollVote.create({
                    data: {
                        poll_id: message.payload.pollId,
                        option_id: message.payload.optionId,
                        user_id: Number(message.payload.userId)
                    }
                })
            }

            const updatedPoll = await this.prisma.poll.findUnique({
                where: {
                    id: message.payload.pollId
                },
                include: WebSocketDatabaseManager.pollInclude
            });

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: updatedPoll,
                type: message.type
            }));

        } catch (err) {
            console.log("Error while voting ", err);
        }

    }

    private async welcomeUserHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        console.log("channel key is : ", channelKey);

        try {

            const user = await this.prisma.users.findUnique({
                where: { id: Number(message.payload.userId) }
            })

            const welcomeChannel = await this.prisma.welcomeChannel.findUnique({
                where: {
                    organization_id: message.payload.organizationId
                }
            })

            if (!welcomeChannel) {
                throw new Error('Welcome channel not found');
            }

            const welcomeUser = await this.prisma.welcomedUser.create({
                data: {
                    welcome_channel_id: welcomeChannel.id,
                    user_id: Number(message.payload.userId),
                    message: `Welcome ${user?.name}! We're delighted to have you as part of our organization.`
                },
                include: {
                    user: true
                }
            })

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: welcomeUser,
                type: message.type
            }));

        } catch (err) {
            console.log("Error while welcoming user ", err);
        }

    }

    private async announcementHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        try {
            const announcement = await this.prisma.announcement.create({
                data: {
                    channel_id: message.payload.channelId,
                    title: message.payload.title,
                    content: message.payload.content,
                    priority: message.payload.priority,
                    tags: message.payload.tags,
                    creator_org_user_id: message.payload.userId
                }
            })

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: announcement,
                type: message.payload.type
            }))

        } catch (err) {
            console.log("Error in creating annoucement");
        }
    }

    private async deleteMessageHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        const currentUSerMEssageCheck = await this.prisma.chats.findUnique({
            where: { id: message.payload.messageId },
            include: {
                organization_user: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (Number(tokenData.userId) === Number(currentUSerMEssageCheck?.organization_user.user.id)) {

            const updatedMessage = await this.prisma.chats.update({
                where: { id: message.payload.messageId },
                data: {
                    is_deleted: true,
                    deleted_at: new Date()
                }
            });

            const broadcastMessage = {
                ...updatedMessage,
                message: "[ This message has been deleted ]"
            };

            this.publisher.publish(channelKey, JSON.stringify({
                payload: broadcastMessage,
                type: message.type
            }))

        }


    }

    private async editMessageHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })


        const currentUSerMEssageCheck = await this.prisma.chats.findUnique({
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

    private async insertProjectChannelMessage(message: WebSocketMessage, tokenData: any) {

        await this.prisma.projectChat.create({
            data: {
                id: message.payload.id,
                project_id: message.payload.project_id,
                organization_id: message.payload.organization_user.organization_id,
                org_user_id: Number(message.payload.org_user_id),
                message: message.payload.message,
                name: message.payload.name,
            }
        })

        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: tokenData.userId,
            timeStamp: Date.now()
        }))
    }

    private async projectChannelEditMessageHandler(message: WebSocketMessage, tokenData: any) {
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

    private async newTaskCreationHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        });

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

        // Then for each assignee, find or create their project member record
        // and create the task assignee relationship
        if (message.payload.assignees && message.payload.assignees.length > 0) {
            for (const assigneeId of message.payload.assignees) {
                // Find or create project member
                let projectMember = await this.prisma.projectMember.findUnique({
                    where: {
                        project_id_org_user_id: {
                            project_id: message.payload.projectId,
                            org_user_id: assigneeId
                        }
                    }
                });

                // If user is not a project member yet, add them
                if (!projectMember) {
                    projectMember = await this.prisma.projectMember.create({
                        data: {
                            project_id: message.payload.projectId,
                            org_user_id: assigneeId,
                            role: 'MEMBER' // Default role
                        }
                    });
                }

                // Create task assignee relationship
                await this.prisma.taskAssignees.create({
                    data: {
                        task_id: task.id,
                        project_member_id: projectMember.id
                    }
                });
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
        console.log("updated task is : ", updatedTask);

        await this.publisher.publish(channelKey, JSON.stringify({
            type: message.type,
            payload: updatedTask
        }));
    }

    private async taskAssigneeChangeHandler(message: WebSocketMessage, tokenData: any) {
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
            console.log("task id is: ", message.payload.task_id);
            console.log("project member id is: ", projectMemberId);

            const existingAssignee = await this.prisma.taskAssignees.findUnique({
                where: {
                    task_id_project_member_id: {
                        task_id: message.payload.task_id,
                        project_member_id: projectMemberId
                    }
                }
            });

            console.log("existing task assignee is: ", existingAssignee);

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


    private async newProjectCreationHandler(message: WebSocketMessage, tokenData: any) {

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

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }

    private calculateExpirationTime(expiresIn: string): Date {
        const now = new Date();
        switch (expiresIn) {
            case '1h':
                return new Date(now.getTime() + 60 * 60 * 1000);
            case '6h':
                return new Date(now.getTime() + 6 * 60 * 60 * 1000);
            case '12h':
                return new Date(now.getTime() + 12 * 60 * 60 * 1000);
            case '24h':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case '48h':
                return new Date(now.getTime() + 48 * 60 * 60 * 1000);
            case '1w':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            default:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default 24h
        }
    }
}