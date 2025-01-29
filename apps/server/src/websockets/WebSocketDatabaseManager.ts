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

    async handleIncomingMessage(message: WebSocketMessage, userData: any) {
        try {
            switch (message.type) {
                case 'insert-general-channel-message':
                    return this.insertGeneralChannelMessage(message, userData);
                case 'typing-event':
                    return this.typingEvent(message, userData)
                case 'new-poll':
                    return this.newPollHandler(message, userData)
                case 'active-poll':
                    return this.activePollHandler(message, userData);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    private async insertGeneralChannelMessage(message: WebSocketMessage, userData: any) {

        await this.prisma.chats.create({
            data: {
                channel_id: message.payload.channelId,
                org_user_id: Number(message.payload.org_user_id),
                message: message.payload.message,
                name: message.payload.name,
            }
        })

        const channelKey = this.getChannelKey({
            organizationId: userData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })

        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: userData.userId,
            timeStamp: Date.now()
        }))
    }

    private async typingEvent(message: WebSocketMessage, userData: any) {
        const channelKey = this.getChannelKey({
            organizationId: userData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        })
        await this.publisher.publish(channelKey, JSON.stringify({
            ...message,
            userId: userData.userId,
        }))
    }

    private async newPollHandler(message: WebSocketMessage, userData: any) {
        const channelKey = this.getChannelKey({
            organizationId: userData.organizationId,
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
                creator_id: Number(message.payload.userId)
            },
            include: WebSocketDatabaseManager.pollInclude
        })
        await this.publisher.publish(channelKey, JSON.stringify({
            payload: poll,
            type: message.type
            // userId: userData.userId
        }))
    }

    private async activePollHandler(message: WebSocketMessage, userData: any) {
        const channelKey = this.getChannelKey({
            organizationId: userData.organizationId,
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