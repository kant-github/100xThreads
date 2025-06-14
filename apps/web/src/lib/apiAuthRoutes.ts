import Env from "./env";

export const BASE_URL = Env.BACKEND_URL;
export const API_URL = BASE_URL + "/api";

export const ORGANIZATION_AND_USER_SEARCH = API_URL + '/organizations-and-user-by-search'
export const USER_URL = API_URL + "/user";
export const LOGIN_URL = API_URL + "/auth/login";
export const CHAT_GROUP = API_URL + "/chat-group";
export const ORGANIZATION = API_URL + "/organizations";
export const RECENT_CHAT_GROUP = API_URL + "/recent-chat-group-join";
export const CHAT_GROUP_USERS = API_URL + "/chat-group-user";
export const CHATS_URL = API_URL + "/chats";
export const POLL_URL = API_URL + "/polls";
export const P2P_URL = API_URL + '/p2p';
export const ORGANIZATION_SETTINGS = ORGANIZATION + "/settings"
export const EVENT_URL = ORGANIZATION + "/event"

export const FRONTEND_BASE_URL = Env.APP_URL;
