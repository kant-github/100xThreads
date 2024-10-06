import dotenv from 'dotenv';
import { Redis } from 'ioredis';

dotenv.config();

const url = process.env.REDIS_URL;


if (!url) {
    throw new Error("REDIS_URL environment variable is not defined.");
}

const redis = new Redis(url); 

export default redis;
