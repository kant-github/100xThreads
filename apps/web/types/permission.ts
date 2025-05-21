export enum Action {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage' // Special permission that grants all access
}

export enum Subject {
    CHANNEL = 'channel',
    MESSAGE = 'message',
    PROJECT = 'project',
    TASK = 'task',
    POLL = 'poll',
    EVENT = 'event',
    ORGANIZATION = 'organization',
    ANNOUNCEMENT = 'announcement',
    PROJECT_CHAT = 'project_chat',
    TAGS = 'tags',
    USER_SETTINGS = 'user_settings'
}

export type Permission = {
    action: Action;
    subject: Subject;
    conditions?: Record<string, any>;
};