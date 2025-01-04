"use client";
import ChatBase from "@/components/chat/ChatBase";
import ChatNav from "@/components/chat/ChatNav";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import GroupPermissionDialogBox from "@/components/utility/groupPermissionDialogBox";
import fetchChats from "fetch/fetchChats";
import { fetchChatGroupUsers, fetchGroup } from "fetch/fetchGroups";
import { useEffect, useState } from "react";
import { MessageType } from "types";
import { useSession } from "next-auth/react";
import { clearCache } from "actions/common";

export default function ChatComponent({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<MessageType[]>([]);
  const [chatGroupUsers, setChatGroupUsers] = useState<any[]>([]);
  const [group, setGroup] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [permissionChecked, setPermissionChecked] = useState<boolean>(false); // New
  const { data: session, status } = useSession();

  useEffect(() => {
    const storedData = localStorage.getItem(params.id);
    setHasPermission(!!storedData);
  }, [params.id]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user?.token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = session.user.token;

        const [groupData, chatGroupUsersData, chatsData] = await Promise.all([
          fetchGroup(token, params.id),
          fetchChatGroupUsers(params.id),
          fetchChats(params.id),
        ]);

        setGroup(groupData);
        setChatGroupUsers(chatGroupUsersData);
        setChats(chatsData);

        setPermissionChecked(true);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session?.user?.token, params.id]);

  // Always defined to avoid conditional hook usage
  useEffect(() => {
    if (hasPermission && permissionChecked) {
      clearCache("recentgroups");
    }
  }, [hasPermission, permissionChecked]);

  if (loading) {
    return <ChatSkeleton />;
  }

  if (!hasPermission && permissionChecked) {
    return (
      <GroupPermissionDialogBox
        setChatGroupUsers={setChatGroupUsers}
        group={group}
        setPermissionDialogBox={setHasPermission}
      />
    );
  }

  return (
    <div>
      <ChatNav />
      <ChatBase
        users={chatGroupUsers}
        group={group}
        groupId={params.id}
        olderChats={chats}
      />
    </div>
  );
}
