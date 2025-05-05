import Redis from "ioredis";
import { PrismaClient } from ".prisma/client";
import { ChannelSubscription, WebSocketMessage } from "../webSocketServer";
import KafkaProducer from "../../kafka/KafkaProducer";
import { NotificationType } from "../types";



export default class FriendsChannelManager {
    private prisma: PrismaClient;
    private publisher: Redis;
    private kafkaProducer: KafkaProducer

    constructor(prisma: PrismaClient, publisher: Redis, kafkaProducer: KafkaProducer) {
        this.prisma = prisma;
        this.publisher = publisher;
        this.kafkaProducer = kafkaProducer
    }

    public async handleIncomingFriendRequest(message: WebSocketMessage, tokenData: any) {
        const channelKey = this.getChannelKey({
            organizationId: message.payload.organization_id,
            channelId: message.payload.channel_id,
            type: message.payload.type
        })

        const friendRequest = await this.prisma.friendRequest.update({
            where: {
                id: message.payload.reference_id
            },
            data: {
                status: 'ACCEPTED'
            },
            include: {
                sender: true,
                reciever: true
            }
        })

        const senderId = friendRequest.sender_id;
        const receiverId = friendRequest.reciever_id;

        const [user_id_1, user_id_2] = senderId < receiverId
            ? [senderId, receiverId]
            : [receiverId, senderId];

        const friendship = await this.prisma.friendship.create({
            data: {
                user_id_1,
                user_id_2
            }
        })
        await this.publisher.publish(channelKey, JSON.stringify({
            payload: "kelapaw",
            type: message.payload.type
        }))
    }

    public async addFriendHandler(message: WebSocketMessage, tokenData: any) {
        const user1 = Number(tokenData.userId);
        const user2 = Number(message.payload.friendsId);
        if (!user1 || !user2) {
            console.log("informations are missing")
            return;
        }

        try {
            const existingFriendRequest = await this.prisma.friendRequest.findUnique({
                where: {
                    sender_id_reciever_id: {
                        sender_id: user1,
                        reciever_id: user2
                    }
                }
            })

            if (existingFriendRequest) {
                return;
            }

            const exisitingFriends = await this.prisma.friendship.findUnique({
                where: {
                    user_id_1_user_id_2: {
                        user_id_1: Math.min(user1, user2),
                        user_id_2: Math.max(user1, user2)
                    }
                }
            })

            if (exisitingFriends) {
                return;
            }

            const friendRequest = await this.prisma.friendRequest.create({
                data: {
                    sender_id: user1,
                    reciever_id: user2,
                    message: message.payload.message || "I'd like to add you as a friend"
                },
                include: {
                    sender: true
                }
            });

            const notificationData: NotificationType = {
                user_id: user2,
                type: 'FRIEND_REQUEST_RECEIVED',
                title: 'Friend request',
                message: `${friendRequest.sender.name} sent you a friend request`,
                created_at: Date.now().toString(),
                sender_id: user1,
                reference_id: friendRequest.id,
                metadata: {
                    image: friendRequest.sender.image
                }
            }
            this.kafkaProducer.sendMessage('notifications', notificationData, Number(user2))

        } catch (err) {
            console.log("Error in creating friendship", err);
        }

    }

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }
}