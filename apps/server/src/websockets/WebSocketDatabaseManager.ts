import { PrismaClient } from ".prisma/client";
import Redis from "ioredis";
import { ChannelSubscription, WebSocketMessage } from "./webSocketServer";
import GeneralChannelManager from "./ws-controllers/GeneralChannelManager";
import WelcomeChannelManager from "./ws-controllers/WelcomeChannelManager";
import AnnouncementchannelManager from "./ws-controllers/AnnouncementchannelManager";
import ProjectChannelManager from "./ws-controllers/ProjectChannelManager";

export default class WebSocketDatabaseManager {
    
    private prisma: PrismaClient;
    private publisher: Redis;
    private generalchannelManager: GeneralChannelManager;
    private welcomeChannelManager: WelcomeChannelManager;
    private announcementchannelManager: AnnouncementchannelManager;
    private projectChannelManager: ProjectChannelManager;

    constructor(prisma: PrismaClient, publisher: Redis) {
        this.prisma = prisma;
        this.publisher = publisher;
        this.generalchannelManager = new GeneralChannelManager(prisma, publisher);
        this.welcomeChannelManager = new WelcomeChannelManager(prisma, publisher);
        this.announcementchannelManager = new AnnouncementchannelManager(prisma, publisher);
        this.projectChannelManager = new ProjectChannelManager(prisma, publisher);
    }

    async handleIncomingMessage(message: WebSocketMessage, tokenData: any) {
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
                    return this.addFriendHandler(message, tokenData);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    private async addFriendHandler(message: WebSocketMessage, tokenData: any) {
        const user1 = Number(tokenData.userId);
        const user2 = Number(message.payload.friendsId);

        if (!user1 || !user2) {
            console.log("informationd are missing")
            return;
        }

        try {
            // check for existing request
            const existingFriendRequest = await this.prisma.friendRequest.findUnique({
                where: {
                    sender_id_reciever_id: {
                        sender_id: user1,
                        reciever_id: user2
                    }
                }
            })

            if (existingFriendRequest) {
                console.log("Friend request already exists");
                return;
            }

            //check existing friendship
            const exisitingFriends = await this.prisma.friendship.findUnique({
                where: {
                    user_id_1_user_id_2: {
                        user_id_1: Math.min(user1, user2),
                        user_id_2: Math.max(user1, user2)
                    }
                }
            })

            if (exisitingFriends) {
                console.log("Users are already friends");
                return;
            }

            const friendRequest = await this.prisma.friendRequest.create({
                data: {
                    sender_id: user1,
                    reciever_id: user2,
                    message: message.payload.message || "I'd like to add you as a friend"
                }
            });

        } catch (err) {
            console.log("Error in creating friendship", err);
        }

    }

    private getChannelKey(subscription: ChannelSubscription): string {
        return `${subscription.organizationId}:${subscription.channelId}:${subscription.type}`
    }


}