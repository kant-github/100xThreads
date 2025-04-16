import { Consumer, Kafka, KafkaMessage } from "kafkajs";
import WebSocketServerManager from "../sockets/WebSocketServer";
import { PrismaClient } from '@prisma/client';
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

  // Add more detailed connection logging in initialize()
  public async initialize(topics: string[]): Promise<void> {
    try {
      console.log(`Attempting to connect to Kafka brokers...`);
      await this.consumer.connect();
      console.log(`Connected to Kafka successfully`);

      for (const topic of topics) {
        console.log(`Subscribing to topic: ${topic}`);
        await this.consumer.subscribe({ topic: topic, fromBeginning: true });
        console.log(`Successfully subscribed to topic: ${topic}`);
      }

      console.log('Kafka consumer initialized and subscribed to topics:', topics);
    } catch (err) {
      console.error('Failed to initialize Kafka consumer:', err);
      throw err;
    }
  }

  public async start(): Promise<void> {
    console.log("Message consumption starting...");

    if (this.isRunning) {
      console.log("Consumer is already running");
      return;
    }

    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log(`Received message from topic ${topic}, partition ${partition}`);
          console.log(`Message key: ${message.key?.toString()}`);
          console.log(`Message value: ${message.value?.toString()}`);
          await this.processMessage(message);
        }
      });

      this.isRunning = true;3
      console.log('Kafka consumer started successfully');
    } catch (err) {
      console.error("Error in starting the kafka consumer:", err);
    }
  }

  private async processMessage(message: KafkaMessage): Promise<void> {
    console.log('Received Kafka message:', message.toString()); // Add this line

    try {
      if (!message.value) {
        console.warn('Received message with no value');
        return;
      }

      const eventData: NotificationEvent = JSON.parse(message.value.toString());
      console.log('Processing notification event:', eventData.type);

      // Store notification in database
      // const notification = await this.storeNotification(eventData);

      // Send notification to user via WebSocket
      // this.wsManager.sendToUser(eventData.recipientUserId, {
      //   type: 'NOTIFICATION',
      //   notification: {
      //     id: notification.id,
      //     type: notification.type,
      //     title: notification.title,
      //     message: notification.message,
      //     is_read: notification.is_read,
      //     created_at: notification.created_at,
      //     metadata: notification.metadata,
      //     action_url: notification.action_url,
      //   }
      // });

    } catch (error) {
      console.error('Error processing message:', error);
    }
  }


  private async storeNotification(event: NotificationEvent) {
    // Store notification in database
    return await this.prisma.notification.create({
      data: {
        user_id: Number(event.recipientUserId), // Assuming user_id is Int in your schema
        type: event.type as any, // Cast to enum type
        title: event.title,
        message: event.message,
        reference_id: event.referenceId,
        organization_id: event.organizationId,
        channel_id: event.channelId,
        sender_id: event.senderId,
        metadata: event.metadata || {},
        action_url: event.actionUrl
      }
    });
  }


  public async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('Consumer is not running');
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isRunning = false;
      console.log('Kafka consumer stopped');
    } catch (error) {
      console.error('Error stopping Kafka consumer:', error);
      throw error;
    }
  }
}