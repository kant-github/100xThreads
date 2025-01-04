export type ChatGroupType = {
  id: string;
  organization_id: string;
  title: string; 
  passcode?: string;
  groupImage?: string;
  created_at: string; 
  Chats: MessageType[];
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
  privateFlag: boolean;
  hasPassword: boolean;
  password?: string;
  image?: string;
  organizationColor: string;
  organization_type: string;
  created_at: string;
};
