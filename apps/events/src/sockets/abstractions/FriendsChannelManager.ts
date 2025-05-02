import Redis from "ioredis";
import { PrismaClient } from ".prisma/client";
import { NotificationType } from "../../types/types";

export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: number;
    senderId?: string;
}

export default class FriendsChannelManager {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async handleIncomingFriendRequest(message: WebSocketMessage) {
        console.log("new message is : ", message);
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
        console.log("Friendship created:", friendship);
        return friendship;
    }

    public async addFriendHandler(message: WebSocketMessage, tokenData: any) {
        const user1 = Number(tokenData.userId);
        const user2 = Number(message.payload.friendsId);
        console.log("here");
        if (!user1 || !user2) {
            console.log("informationd are missing")
            return;
        }

        try {
            // check for existing request
            const existingFriendRequest = await this.prisma.friendRequest.findUnique({
                where: {
                    sender_id_reciever_id: {
                        sender_id: user1,
                        reciever_id: user2
                    }
                }
            })

            if (existingFriendRequest) {
                console.log("Friend request already exists");
                return;
            }

            //check existing friendship
            const exisitingFriends = await this.prisma.friendship.findUnique({
                where: {
                    user_id_1_user_id_2: {
                        user_id_1: Math.min(user1, user2),
                        user_id_2: Math.max(user1, user2)
                    }
                }
            })

            if (exisitingFriends) {
                console.log("Users are already friends");
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
                reference_id: friendRequest.id
            }
            console.log("kafka stream will recieve : ", notificationData);

        } catch (err) {
            console.log("Error in creating friendship", err);
        }

    }

}