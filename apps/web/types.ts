export type ChannelType = {
  id: string
  organization: OrganizationType
  organization_id: string
  title: string
  type: ChannelType
  passcode: string
  groupImage?: string
  created_at: Date
  created_by: number
  creator: UserType
  is_archived: boolean
  allowed_roles: UserRole
  description?: string
  // Chats: 
  // Announcements        Announcement[]
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
  group_id: string;
  user_id: number;
  message: string;
  name: string;
  created_at: string;
  user?: UserType;
  LikedUsers: LikedUser[];
};

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
  organization: OrganizationType
  organization_id: string
  user: UserType
  user_id: number
  role: UserRole
  joined_at: Date
}


export type EventChannelType = {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  created_at: string;
  created_by: number;
}

export type WelcomeChannel = {
  id: string
  organizationId: string
  welcome_message: string | null
  welcomedUsers: WelcomedUser[]
  roleRequests: RoleRequest[]
  createdAt: Date
}

export type WelcomedUser = {
  id: string
  welcomeChannelId: string
  userId: number
  user: UserType
  message: string | null
  welcomedAt: Date
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


