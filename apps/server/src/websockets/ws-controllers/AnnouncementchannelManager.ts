import Redis from "ioredis";
import { PrismaClient } from ".prisma/client";
import { ChannelSubscription, WebSocketMessage } from "../webSocketServer";

export default class AnnouncementchannelManager {
    private prisma: PrismaClient;
    private publisher: Redis;

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
    }


    public async announcementHandler(message: WebSocketMessage, tokenData: any) {
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

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }
}