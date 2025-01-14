"use client";
import { useEffect, useMemo, useState } from "react";
import ChatSideBar from "./ChatSideBar";
import ChatNavTitle from "./ChatNavTitle";
import Chat from "./Chat";
import { ChatGroupType, GroupChatUserType, MessageType, UserType } from "types";
import { getSocket } from "@/lib/socket.front";

interface Props {
  groupId: string;
  group: ChatGroupType | null;
  users: GroupChatUserType[];
  olderChats: MessageType[];
}

export default function ({ groupId, group, users, olderChats }: Props) {
  const [chatUser, setChatUser] = useState<UserType | null>(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState<number>(0);
  const [onlineUsersList, setOnlineUsersList] = useState<number[] | []>([])

  useEffect(() => {
    const fetchChatUserFromLocalStorage = () => {
      if (group?.id && !chatUser) {
        const data = localStorage.getItem(group.id);
        if (data) {
          const pData = JSON.parse(data);
          setChatUser(pData.user);
        }
      }
    };

    fetchChatUserFromLocalStorage();
  }, [group?.id, chatUser]);

  const socket = useMemo(() => {
    if (chatUser?.id && group) {
      return getSocket(groupId, chatUser.id);
    }
    return null;
  }, [groupId, chatUser?.id]);

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

  }, [socket, groupId, chatUser?.id]);

  return (
    <div className="flex flex-row w-screen bg-[#f2f2f2] dark:bg-[#1c1c1c]">
      <ChatSideBar onlineUsersList={onlineUsersList} users={users} />
      <div className="w-full mx-6">
        <ChatNavTitle onlineUsersCount={onlineUsersCount} groupId={groupId} groupImage={group?.groupImage!} groupTitle={group?.title!} />
        <Chat socket={socket} users={users} chatUser={chatUser} olderChats={olderChats} group={group!} />
      </div>
    </div>
  );
};