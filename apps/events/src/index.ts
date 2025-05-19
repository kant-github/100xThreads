import express from 'express'
import { createServer } from 'http';
import cors from 'cors';
import config from './config';
import WebSocketServerManager from './sockets/WebSocketServer';
import KafkaConsumerService from './services/KafkaService';
const app = express();
const server = createServer(app);
const wsManager = new WebSocketServerManager(server);


app.use(cors());
app.use(express.json());


const kafkaConsumerService = new KafkaConsumerService(
    ['13.53.234.218:9092'],
    'notification-service-group',
    wsManager,
    ['notifications']
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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.listen(7002, () => {
    console.log(`Notification server running on port ${config.server.port}`);
})