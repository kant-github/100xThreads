import Redis from "ioredis";
import { PrismaClient } from ".prisma/client";
import { ChannelSubscription, WebSocketMessage } from "../webSocketServer";

export default class WelcomeChannelManager {
    private prisma: PrismaClient;
    private publisher: Redis;

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
    }


    public async welcomeUserHandler(message: WebSocketMessage, tokenData: any) {
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

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }
}