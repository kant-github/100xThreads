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
        console.log("channel key is : ", channelKey);
        console.log("message is : ", message);

        try {
            const announcement = await this.prisma.announcement.create({
                data: {
                    channel_id: message.payload.channelId,
                    title: message.payload.title,
                    content: message.payload.content,
                    priority: message.payload.priority,
                    tags: message.payload.tags,
                    creator_org_user_id: Number(message.payload.userId)
                },
                include: {
                    creator: {
                        select: {
                            user: true
                        }
                    }
                }
            })

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: announcement,
                type: message.payload.type
            }))

        } catch (err) {
            console.log("Error in creating annoucement", err);
        }
    }

    public async updateAnnouncementHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        });

        try {
            const updatedAnnouncement = await this.prisma.announcement.update({
                where: {
                    id: message.payload.announcementId
                },
                data: {
                    title: message.payload.title,
                    content: message.payload.content,
                    priority: message.payload.priority,
                    tags: message.payload.tags
                }
            });

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: updatedAnnouncement,
                type: message.payload.type
            }));

        } catch (err) {
            console.log("Error in updating announcement", err);
        }
    }

    public async deleteAnnouncementHandler(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: tokenData.organizationId,
            channelId: message.payload.channelId,
            type: message.payload.type
        });
        console.log("channel key is : ", channelKey);
        console.log("message came is : ", message);

        try {
            const deletedAnnouncement = await this.prisma.announcement.delete({
                where: {
                    id: message.payload.announcementId
                }
            });
            console.log("deleted annoucnemnt is : ", deletedAnnouncement);

            await this.publisher.publish(channelKey, JSON.stringify({
                payload: deletedAnnouncement,
                type: message.payload.type
            }));

        } catch (err) {
            console.log("Error in deleting announcement", err);
        }
    }

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`;
    }
}