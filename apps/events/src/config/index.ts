import dotenv from 'dotenv';
dotenv.config();

export default {
    server: {
        port: process.env.PORT || 7002,
        env: process.env.NODE_ENV || 'development',
    },
    kafka: {
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        groupId: process.env.KAFKA_GROUP_ID || 'notification-service',
        topics: {
            notifications: process.env.KAFKA_NOTIFICATION_TOPIC || 'notifications',
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    }
};