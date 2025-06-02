import { PrismaClient } from ".prisma/client";
import { WebSocketMessage } from "./FriendsChannelManager";

export default class P2pChatsManager {

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async handleIncomingNewMessage(message: WebSocketMessage) {
        const chat = await this.prisma.chatMessageOneToOne.create({
            data: {
                senderId: message.payload.senderId,
                receiverId: message.payload.receiverId,
                content: message.payload.content,
                created_at: new Date(message.payload.created_at)
            },
            include: {
                sender: true,
                receiver: true
            }
        })

        return chat;
    }

    public handleIncomingTypingEvents(message: WebSocketMessage) {
        return message;
    }
}