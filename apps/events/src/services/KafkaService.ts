import { Consumer, Kafka, KafkaMessage } from "kafkajs";
import WebSocketServerManager from "../sockets/WebSocketServer";
import { PrismaClient } from '.prisma/client';
import prisma from '@repo/db/client';

interface NotificationEvent {
  type: string;
  recipientUserId: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  referenceId?: string;
  organizationId?: string;
  channelId?: string;
  senderId?: number;
  actionUrl?: string;
}

export default class KafkaConsumerService {
  private consumer: Consumer;
  private wsManager: WebSocketServerManager
  private prisma: PrismaClient;
  private isRunning: boolean = false;

  constructor(brokers: string[], groupId: string, wsManager: WebSocketServerManager, topics: string[] = ['notifications']) {

    const kafka = new Kafka({
      clientId: 'notification-server',
      brokers
    })

    this.wsManager = wsManager;
    this.consumer = kafka.consumer({ groupId });
    this.prisma = prisma;
    // this.initialize(topics);
  }

  public async initialize(topics: string[]): Promise<void> {
    try {
      await this.consumer.connect();

      for (const topic of topics) {
        await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      }

    } catch (err) {
      console.error('Failed to initialize Kafka consumer:', err);
      throw err;
    }
  }

  public async start(): Promise<void> {

    if (this.isRunning) {
      return;
    }

    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.processMessage(message);
        }
      });

      this.isRunning = true;
    } catch (err) {
      console.error("Error in starting the kafka consumer:", err);
    }
  }

  private async processMessage(message: KafkaMessage): Promise<void> {
    try {
      if (!message.value) {
        console.warn('Received message with no value');
        return;
      }

      const eventData: NotificationEvent = JSON.parse(message.value.toString());

      const notification = await this.storeNotification(eventData);

      this.wsManager.sendToUser('1', {
        type: 'NOTIFICATION',
        notification: {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          is_read: notification.is_read,
          created_at: notification.created_at,
          metadata: notification.metadata,
          action_url: notification.action_url,
        }
      });

    } catch (error) {
      console.error('Error processing message:', error);
    }
  }


  private async storeNotification(event: NotificationEvent) {

    return await this.prisma.notification.create({
      data: {
        user_id: Number(1), // Assuming user_id is Int in your schema
        type: 'EVENT_CANCELLED',
        title: event.title,
        message: event.message,
        // reference_id: event.referenceId,
        // organization_id: event.organizationId,
        // channel_id: '0f7940bb-b639-4292-a718-5ad9a554f3a1',
        // sender_id: 1,
        // action_url: event.actionUrl
      }
    });
  }


  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isRunning = false;
    } catch (error) {
      console.error('Error stopping Kafka consumer:', error);
      throw error;
    }
  }
}