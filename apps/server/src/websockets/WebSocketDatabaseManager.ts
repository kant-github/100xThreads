import { PrismaClient } from ".prisma/client";
import Redis from "ioredis";
import { ChannelSubscription, WebSocketMessage } from "./webSocketServer";

export default class WebSocketDatabaseManager {

    private prisma: PrismaClient;
    private publisher: Redis

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
    }

    async handleIncomingMessage(message: WebSocketMessage, userData: any) {
        console.log("incoming message is : ", message.type);
        try {
            switch (message.type) {
                case 'insert-general-channel-message':
                    return this.insertGeneralChannelMessage(message, userData);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    private async insertGeneralChannelMessage(message: WebSocketMessage, userData: any) {

        console.log('Attempting to create chat with:', {
            channel_id: message.payload.channel_id,
            org_user_id: Number(message.payload.org_user_id),
            organizationId: userData.organizationId
        });

        await this.prisma.organizationUsers.findUnique({
            where: {
                id: 1,
                organization_id: '8c73db2c-b25f-4e6c-831c-653804c7b077'
            }
        });


        const chat = await this.prisma.chats.create({
            data: {
                channel_id: message.payload.channel_id,
                org_user_id: Number(message.payload.org_user_id),
                message: message.payload.message,
                name: message.payload.name,
            }
        })

        console.log("database chat created : ", chat);

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

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }
}