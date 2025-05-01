import { Kafka } from 'kafkajs'
import { NotificationType } from '../websockets/types';

interface KafkaMessage {
    value: NotificationType,
    userId: Number
}

export default class KafkaProducer {
    private kafka: Kafka;
    private isConnected: boolean = false;
    private producer;

    constructor(brokers: string[], clientId: string) {
        this.kafka = new Kafka({
            brokers,
            clientId
        })

        this.producer = this.kafka.producer();
        this.connect();
    }

    private async connect() {
        if (!this.isConnected) {
            try {
                await this.producer.connect();
                this.isConnected = true;
            } catch (err) {
                console.error('Failed to connect to Kafka:', err);
            }
        }
    }

    private async disconnect() {
        if (this.isConnected) {
            try {
                await this.producer.disconnect();
                this.isConnected = false;
                console.log('Disconnected from Kafka broker');
            } catch (error) {
                console.error('Error disconnecting from Kafka:', error);
                throw error;
            }
        }
    }


    public async sendMessage(
        topic: string,
        message: any,
        userId: Number
    ) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            const kafkaMessage: KafkaMessage = {
                value: message,
                userId
            };

            return await this.producer.send({
                topic,
                messages: [{
                    value: JSON.stringify(kafkaMessage)
                }],
            });
        } catch (error) {
            console.error(`Error sending message to topic ${topic}:`, error);
            throw error;
        }
    }
}