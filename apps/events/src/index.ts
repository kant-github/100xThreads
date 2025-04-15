import express from 'express'
import { createServer } from 'http';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';
const app = express();
const server = createServer(app);


app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(config.server.port, () => {
    logger.info(`Notification server running on port ${config.server.port}`);
})