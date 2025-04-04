export type ChannelType = {
  id: string
  organization: OrganizationType
  organization_id: string
  title: string
  type: ChannelTypeType
  passcode: string
  groupImage?: string
  created_at: Date
  created_by: number
  creator: UserType
  is_archived: boolean
  allowed_roles: UserRole
  description?: string
  // Chats: 
  Announcements: AnnouncementType[]
  // RecentlyJoinedGroups RecentlyJoinedGroups[]
};

export type GroupChatUserType = {
  id: number;
  group_id: string;
  user_id: number;
  joined_at: string;
  user: UserType;
};

export type UserType = {
  id: number;
  name: string;
  image: string;
  email: string;
  bio: string;
  provider: string;
  oauth_id: string;
  created_at: string;
};

export type MessageType = {
  id: string;
  message: string | null;
  name: string;
  created_at: Date;
  channel_id?: string;
  is_deleted: boolean;
  deleted_at?: Date | null;
  is_edited: boolean;
  edited_at?: Date | null
  org_user_id: number;
  organization_user?: OrganizationUsersType;
  channel?: ChannelType;
  LikedUsers: LikedUser[];
}

export type LikedUser = {
  id?: number;
  message_id: string;
  user_id: number;
  username: string
  created_at?: string;
};


export type OrganizationType = {
  id: string;
  name: string;
  description: string;
  owner_id: number;
  owner: UserType;
  privateFlag: boolean;
  hasPassword: boolean;
  password?: string;
  image?: string;
  organizationColor: string;
  organization_type: string;
  created_at: string;
  tags: string[];
};

export type OrganizationUsersType = {
  id: number;
  organization?: OrganizationType
  organization_id: string
  user: UserType
  user_id: number
  role: UserRole
  joined_at?: Date
}

export interface AnnouncementType {
  id: string;
  channel_id: string;
  title: string;
  content: string;
  priority: Priority;
  tags: string[];
  creator_org_user_id: number;
  creator: OrganizationUsersType;
  created_at: Date;
  expires_at: Date | null;
  is_pinned: boolean;
  requires_ack: boolean;
  AckStatus: AnnouncementAckType[];
}

export interface AnnouncementAckType {
  id: number;
  announcement_id: string;
  user_id: number;
  acked_at: Date;
}

export type EventChannelType = {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  created_at: string;
  created_by: number;
}

export type ProjectTypes = {
  id: string;
  channel_id: string;
  title: string;
  description?: string | null;
  created_at: Date;
  due_date: Date;
  creator_id: number;
  creator: OrganizationUsersType;
  tasks?: TaskTypes[];
  members?: ProjectMemberType[];
}


export type ProjectMemberType = {
  id: number;
  project_id: string;
  org_user_id: number;
  role: ProjectMemberRole;
  joined_at: Date;
  organization_user: OrganizationUsersType;
}

export type ProjectChatTypes = {
  id: string;
  project_id: string;
  project: ProjectTypes;
  organization_id: string;
  org_user_id: number;
  organization_user: OrganizationUsersType;
  message?: string;
  name: string;
  is_deleted: boolean;
  deleted_at?: Date;
  is_edited: boolean;
  edited_at?: Date;

  is_activity: Boolean;
  activity_type?: ProjectActivityType
  activity_data: any;
  related_user_id: Number;

  created_at: Date;
  LikedUsers: LikedUser[];
  Users?: UserType;
  usersId?: number;
  // ChatReaction: ChatReaction[];
}

export interface TaskTypes {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  tags: string[],
  color?: string
  status: TaskStatus;
  priority: Priority;
  due_date?: Date | null;
  created_at: Date;
  assignees?: TaskAssigneeType[];
}

export interface TaskAssigneeType {
  id: number;
  task_id: string;
  task: TaskTypes;
  project_member: ProjectMemberType;
  project_member_id: Number;
  assigned_at?: Date;
}

export type WelcomeChannel = {
  id: string
  organizationId: string
  welcome_message: string | null
  welcomedUsers: WelcomedUserTypes[]
  roleRequests: RoleRequest[]
  createdAt: Date
}

export type WelcomedUserTypes = {
  id: string
  welcomeChannelId: string
  user_id: number
  user: UserType
  message: string | null
  welcomed_at: Date
}

export interface PollTypes {
  id: string;
  channelId: string;
  question: string;
  options: PollOptionTypes[];
  creatorId: number;
  creator: UserType;
  createdAt: string; // ISO string format
  expiresAt?: string; // Optional, ISO string format
  isAnonymous: boolean;
  multipleChoice: boolean;
  status: PollStatus;
  votes: PollVoteTypes[];
}

export interface PollOptionTypes {
  id: string;
  pollId: string;
  text: string;
  votes: PollVoteTypes[];
  createdAt: string; // ISO string format
}

export interface PollVoteTypes {
  id: number;
  pollId: string;
  optionId: string;
  userId: number;
  createdAt: string; // ISO string format
}

export type RoleRequest = {
  id: string
  welcomeChannelId: string
  userId: number
  requestedRole: UserRole
  status: RequestStatus
  createdAt: Date
  updatedAt: Date
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EVENT_MANAGER = 'EVENT_MANAGER',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
  ORGANIZER = 'ORGANIZER',
  OBSERVER = 'OBSERVER',
  IT_SUPPORT = 'IT_SUPPORT',
  HR_MANAGER = 'HR_MANAGER',
  FINANCE_MANAGER = 'FINANCE_MANAGER'
}

export enum ProjectMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum Priority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW"
}

export enum ChannelTypeType {
  WELCOME = 'WELCOME',
  GENERAL = 'GENERAL',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  RESOURCE = 'RESOURCE',
  HELP_DESK = 'HELP_DESK',
  PROJECT = 'PROJECT',
  LEARNING = 'LEARNING',
  MENTORSHIP = 'MENTORSHIP',
  SOCIAL = 'SOCIAL',
  CAREER = 'CAREER'
}

export enum PollStatus {
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  CANCELLED = "CANCELLED",
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

enum ProjectActivityType {
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  MEMBER_ROLE_CHANGED = 'MEMBER_ROLE_CHANGED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  OTHER = 'OTHER'
}
