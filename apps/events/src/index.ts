import express from 'express'
import { Kafka } from 'kafkajs';
import { createServer } from 'http';
import cors from 'cors';
import config from './config';
import WebSocketServerManager from './sockets/WebSocketServer';
import KafkaConsumerService from './services/KafkaService';
import prisma from '@repo/db/client';
const app = express();
const server = createServer(app);
const wsManager = new WebSocketServerManager(server);


app.use(cors());
app.use(express.json());


app.get("/store", async (req, res) => {
    const announcement = await prisma.announcement.create({
        data: {
            channel_id: '9af56c66-3a3c-4b83-af53-bdf5ec075a58',
            title: "Checkssss",
            content: "checksssss",
            priority: 'URGENT',
            tags: ['fee', 'checks', 'tags'],
            creator_org_user_id: 1,
        }
    })
    res.json({
        message: "created",
        data: announcement
    })
})

const kafka = new Kafka({
    clientId: 'notification-producer',
    brokers: ['localhost:29092'],
});

const producer = kafka.producer();

async function produceTestNotification() {
    await producer.connect();

    const message = {
        type: 'NEW_MESSAGE',
        recipientUserId: '1',
        title: 'Test Notification',
        message: 'Hello from Kafka!',
        metadata: { source: 'test-script' },
        referenceId: 'xyz123',
        organizationId: 'org_1',
        channelId: 'general',
        senderId: 101,
        actionUrl: '/dashboard',
    };

    await producer.send({
        topic: 'notifications',
        messages: [
            { value: JSON.stringify(message) }
        ],
    });

    console.log('✅ Test notification sent');
    await producer.disconnect();
}

app.get("/produce", (req, res) => {
    for (let i = 0; i < 10; i++) {
        produceTestNotification().catch(console.error);
    }
    res.json({
        message: "produced"
    });

    return;
})


app.get("/consume", (req, res) => {

    const kafkaConsumerService = new KafkaConsumerService(
        ['localhost:29092'],
        'notification-service-group',
        wsManager,
        ['notifications'] // Topics to subscribe to
    );

    (async () => {
        try {
            await kafkaConsumerService.initialize(['notifications']);
            await kafkaConsumerService.start();
        } catch (error) {
            console.error('Failed to start notification service:', error);
            process.exit(1);
        }
    })();
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.listen(7002, () => {
    console.log(`Notification server running on port ${config.server.port}`);
})