import { PrismaClient } from ".prisma/client";


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

        const result = await this.prisma.$transaction(async (tx) => {
            const friendRequest = await tx.friendRequest.update({
                where: { id: message.payload.friendRequestId },
                data: { status: 'ACCEPTED' },
                include: { sender: true, reciever: true }
            });

            const oldNotification = await tx.notification.findFirst({
                where: {
                    reference_id: message.payload.friendRequestId,
                    type: 'FRIEND_REQUEST_RECEIVED',
                    user_id: friendRequest.reciever_id
                }
            });

            if (oldNotification) {
                await tx.notification.delete({
                    where: { id: oldNotification.id }
                });
            }

            const notificationData1 = await tx.notification.create({
                data: {
                    user_id: friendRequest.reciever_id,
                    type: 'FRIEND_REQUEST_ACCEPTED',
                    title: 'You are now friends',
                    message: `You accepted ${friendRequest.sender.name}'s friend request`,
                    metadata: {
                        image: friendRequest.sender.image,
                        oldNotificationId: oldNotification?.id
                    }
                }
            });

            const notificationData2 = await tx.notification.create({
                data: {
                    user_id: friendRequest.sender_id,
                    type: 'FRIEND_REQUEST_ACCEPTED',
                    title: 'Friend request accepted',
                    message: `${friendRequest.reciever.name} has accepted your friend request`,
                    metadata: {
                        image: friendRequest.reciever.image
                    }
                }
            });

            const senderId = friendRequest.sender_id;
            const receiverId = friendRequest.reciever_id;

            const [user_id_1, user_id_2] = senderId < receiverId
                ? [senderId, receiverId]
                : [receiverId, senderId];

            console.log("user id 1 is : ", user_id_1);
            console.log("user id 2 is : ", user_id_2);

            const friendship = await tx.friendship.create({
                data: {
                    user_id_1,
                    user_id_2
                },
                include: {
                    user1: true,
                    user2: true
                }
            });


            return {
                user1: {
                    userId: senderId,
                    data: notificationData2
                },
                user2: {
                    userId: receiverId,
                    data: notificationData1
                }
            };
        });

        return result;
    }


    public async addFriendHandler(message: WebSocketMessage) {
        const user1 = Number(message.payload.userId);
        const user2 = Number(message.payload.friendsId);
        if (!user1 || !user2) {
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

            const notification = await this.prisma.notification.create({
                data: {
                    user_id: Number(user2),
                    type: 'FRIEND_REQUEST_RECEIVED',
                    title: 'Friend Request',
                    message: `${friendRequest.sender.name} sent you a friend request`,
                    created_at: new Date(),
                    sender_id: Number(user1),
                    reference_id: friendRequest.id,
                    metadata: {
                        image: friendRequest.sender.image
                    }

                }
            })

            return {
                user1: {
                    userId: user2,
                    data: notification
                },
            }

        } catch (err) {
            console.log("Error in creating friendship", err);
        }

    }

}