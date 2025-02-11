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

        console.log("active poll message is : ", message);

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

        console.log("Edit message handler called with data : ", message);

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

            console.log("message data is : ", messageData)

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: messageData,
                type: message.type
            }))
        }
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