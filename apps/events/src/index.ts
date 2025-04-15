import express from 'express'
import { createServer } from 'http';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';
import WebSocketServerManager from './sockets/WebSocketServer';
import KafkaConsumerService from './services/KafkaService';
const app = express();
const server = createServer(app);


app.use(cors());
app.use(express.json());

const wsManager = new WebSocketServerManager(server);

const kafkaConsumerService = new KafkaConsumerService(
    ['kafka-broker:9092'], // Replace with your Kafka broker addresses
    'notification-service-group',
    wsManager,
    ['notifications'] // Topics to subscribe to
);

(async () => {
    try {
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
    logger.info(`Notification server running on port ${config.server.port}`);
})