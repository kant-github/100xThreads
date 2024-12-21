import { ChatGroupType, GroupChatUserType, MessageType, UserType } from "types";
import Chat from "../Chat";
import ChatSideBar from "../ChatSideBar";
import { useEffect, useMemo, useState } from "react";
import GlobalChatNavTitle from "./GlobalChatNavTitle";
import { globalGroupId } from "@/components/dashboard/DashNav";
import { getSocket } from "@/lib/socket.config";

interface Props {
    group: ChatGroupType;
    users: GroupChatUserType[];
    olderChats: MessageType[];
}

export default function ({ group, users, olderChats }: Props) {
    const [chatUser, setChatUser] = useState<UserType | null>(null);
    const [chatSidebarOpen, setChatSidebarOpen] = useState<boolean>(false);
    const [onlineUsersCount, setOnlineUsersCount] = useState<number>(0);
    const [onlineUsersList, setOnlineUsersList] = useState<number[] | []>([])

    const socket = useMemo(() => {
        if (chatUser?.id && group) {
            return getSocket(group.id, chatUser.id);
        }
        return null;
    }, [group.id, chatUser?.id]);

    useEffect(() => {
        if (!socket) return;

        const handleOnlineUsers = (message: MessageEvent) => {
            const data = JSON.parse(message.data);
            if (data.type === "online-users") {
                setOnlineUsersCount(data.list.length);
                setOnlineUsersList(data.list);
            }
        }

        socket.addEventListener('message', handleOnlineUsers);

        return () => {
            socket.removeEventListener('message', handleOnlineUsers);
            socket.close()
        }

    }, [socket, group.id, chatUser?.id]);

    useEffect(() => {

        const fetchChatUserFromLocalStorage = () => {
            const data = localStorage.getItem(globalGroupId);
            if (data) {
                const pData = JSON.parse(data);
                setChatUser(pData.user);
            }
        };

        fetchChatUserFromLocalStorage();

    }, [group.id]);


    return (
        <div>
            <div className="flex flex-row w-screen bg-[#f2f2f2] dark:bg-[#1c1c1c]">
                <ChatSideBar onlineUsersList={onlineUsersList} users={users} />
                <div className="w-full mx-6">
                    <GlobalChatNavTitle onlineUsersCount={onlineUsersCount} groupImage={group.groupImage!} groupTitle={group.title} />
                    <Chat socket={socket} users={users} chatUser={chatUser} olderChats={olderChats} group={group} />
                </div>
            </div>
        </div>
    )
}