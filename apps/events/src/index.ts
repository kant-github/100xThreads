import express from 'express'
import { Kafka } from 'kafkajs';
import { createServer } from 'http';
import cors from 'cors';
import config from './config';
import WebSocketServerManager from './sockets/WebSocketServer';
import KafkaConsumerService from './services/KafkaService';
const app = express();
const server = createServer(app);


app.use(cors());
app.use(express.json());


const kafka = new Kafka({
    clientId: 'notification-producer',
    brokers: ['localhost:29092'],
});

const producer = kafka.producer();

async function produceTestNotification() {
    await producer.connect();

    const message = {
        type: 'NEW_MESSAGE',
        recipientUserId: '1', // make sure this user is connected via WS
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
    res.json({
        message: "produced"
    });
    produceTestNotification().catch(console.error);
})


const wsManager = new WebSocketServerManager(server);

const kafkaConsumerService = new KafkaConsumerService(
    ['localhost:29092'], // Replace with your Kafka broker addresses
    'notification-service-group',
    wsManager,
    ['notifications'] // Topics to subscribe to
);

(async () => {
    try {
        await kafkaConsumerService.initialize(['notifications']);
        await kafkaConsumerService.start();
        console.log('Notification service started');

    } catch (error) {
        console.error('Failed to start notification service:', error);
        process.exit(1);
    }
})();

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.listen(config.server.port, () => {
    console.log(`Notification server running on port ${config.server.port}`);
})