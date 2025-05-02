import { PrismaClient } from ".prisma/client";
import Redis from "ioredis";
import { ChannelSubscription, WebSocketMessage } from "./webSocketServer";
import GeneralChannelManager from "./ws-controllers/GeneralChannelManager";
import WelcomeChannelManager from "./ws-controllers/WelcomeChannelManager";
import AnnouncementchannelManager from "./ws-controllers/AnnouncementchannelManager";
import ProjectChannelManager from "./ws-controllers/ProjectChannelManager";
import KafkaProducer from "../kafka/KafkaProducer";
import { NotificationType } from "./types";
import FriendsChannelManager from "./ws-controllers/FriendsChannelManager";

export default class WebSocketDatabaseManager {

    private prisma: PrismaClient;
    private publisher: Redis;
    private generalchannelManager: GeneralChannelManager;
    private welcomeChannelManager: WelcomeChannelManager;
    private announcementchannelManager: AnnouncementchannelManager;
    private projectChannelManager: ProjectChannelManager;
    private kafkaProducer: KafkaProducer
    private friendsChannelManager: FriendsChannelManager;
    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
        this.kafkaProducer = new KafkaProducer(['localhost:29092'], 'notification-producer');
        this.generalchannelManager = new GeneralChannelManager(prisma, publisher);
        this.welcomeChannelManager = new WelcomeChannelManager(prisma, publisher);
        this.announcementchannelManager = new AnnouncementchannelManager(prisma, publisher);
        this.projectChannelManager = new ProjectChannelManager(prisma, publisher);
        this.friendsChannelManager = new FriendsChannelManager(prisma, publisher, this.kafkaProducer);
    }

    public async handleIncomingMessage(message: WebSocketMessage, tokenData: any) {
        try {
            switch (message.type) {
                case 'insert-general-channel-message':
                    return this.generalchannelManager.insertGeneralChannelMessage(message, tokenData);
                case 'delete-message':
                    return this.generalchannelManager.deleteMessageHandler(message, tokenData);
                case 'edit-message':
                    return this.generalchannelManager.editMessageHandler(message, tokenData);
                case 'typing-event':
                    return this.generalchannelManager.typingEvent(message, tokenData)
                case 'new-poll':
                    return this.generalchannelManager.newPollHandler(message, tokenData)
                case 'active-poll':
                    return this.generalchannelManager.activePollHandler(message, tokenData);
                case 'welcome-user':
                    return this.welcomeChannelManager.welcomeUserHandler(message, tokenData);
                case 'new-announcement':
                    return this.announcementchannelManager.announcementHandler(message, tokenData);
                case 'new-project':
                    return this.projectChannelManager.newProjectCreationHandler(message, tokenData);
                case 'project-channel-chat-messages':
                    return this.projectChannelManager.insertProjectChannelMessage(message, tokenData);
                case 'project-channel-edit-message':
                    return this.projectChannelManager.projectChannelEditMessageHandler(message, tokenData);
                case 'project-chat-typing-events':
                    return this.projectChannelManager.projectChatTypingEventHandler(message, tokenData);
                case 'new-created-task':
                    return this.projectChannelManager.newTaskCreationHandler(message, tokenData);
                case 'task-assignee-change':
                    return this.projectChannelManager.taskAssigneeChangeHandler(message, tokenData);
                case 'send-friend-request':
                    return this.friendsChannelManager.addFriendHandler(message, tokenData);
                case 'friend-request-accept':
                    return this.friendsChannelManager.handleIncomingFriendRequest(message, tokenData);

            }
        }
        catch (err) {
            console.log(err);
        }
    }



    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }


}