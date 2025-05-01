export interface NotificationType {
    id?: string;
    user_id: number;
    type: NotificationTypeEnum;
    title: string;
    message: string;
    is_read?: boolean;
    created_at: string; // Use `Date` if hydrated
    reference_id?: string | null;
    organization_id?: string | null;
    channel_id?: string | null;
    sender_id?: number | null;
    metadata?: Record<string, any> | null;
    action_url?: string | null;
}

export type NotificationTypeEnum =
    | 'FRIEND_REQUEST_RECEIVED'
    | 'FRIEND_REQUEST_ACCEPTED'
    | 'FRIEND_REQUEST_REJECTED'
    | 'FRIEND_ONLINE'
    | 'FRIEND_MESSAGE_RECEIVED'
    | 'ORG_INVITE_RECEIVED'
    | 'ORG_JOIN_REQUEST_RESPONSE'
    | 'ORG_ROLE_CHANGED'
    | 'ORG_JOIN_REQUEST_RECEIVED'
    | 'NEW_CHANNEL_MESSAGE'
    | 'CHANNEL_MENTION'
    | 'NEW_ANNOUNCEMENT'
    | 'ANNOUNCEMENT_REQUIRING_ACK'
    | 'EVENT_CREATED'
    | 'EVENT_REMINDER'
    | 'EVENT_UPDATED'
    | 'EVENT_CANCELLED'
    | 'PROJECT_ADDED'
    | 'TASK_ASSIGNED'
    | 'TASK_DUE_SOON'
    | 'TASK_STATUS_CHANGED'
    | 'NEW_POLL'
    | 'POLL_ENDING_SOON'
    | 'POLL_RESULTS'
    | 'ISSUE_ASSIGNED'
    | 'ISSUE_STATUS_CHANGED'
    | 'CHAT_REACTION'
    | 'LIKED_MESSAGE';

