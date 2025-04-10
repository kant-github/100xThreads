import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { WebSocketMessage } from "./webSocketServer";

export default class NotificationManager {
    private prisma: PrismaClient
    private publisher: Redis

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
    }


    async createNotification() {
        
    }
}