import ChatMessageInput from "@/components/chat/ChatMessageInput";
import UtilitySideBar from "@/components/utility/UtilitySideBar";
import { useWebSocket } from "@/hooks/useWebsocket";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { messageEditingState } from "@/recoil/atoms/chats/messageEditingStateAtom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { v4 as uuidv4 } from "uuid";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChannelType, MessageType, ProjectTypes } from "types";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import UserTyping from "@/components/utility/UserTyping";
import EmptyConversation from "@/components/chat/EmptyConversation";
import GroupedByDateMessages from "@/components/chat/messages/GroupedByDateMessages";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";

interface ProjectChatsProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    project: ProjectTypes;
    channel: ChannelType
}

export default function ({ open, setOpen, project, channel }: ProjectChatsProps) {
    const [message, setMessage] = useState<string>('');
    const session = useRecoilValue(userSessionAtom);
    const organizationId = useRecoilValue(organizationIdAtom);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [editingState, setEditingState] = useRecoilState(messageEditingState);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const organizationUser = useRecoilValue(organizationUserAtom);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const groupedMessages = useMemo(() => {
        const grouped: { [key: string]: MessageType[] } = {};

        messages.forEach(message => {
            const date = new Date(message.created_at).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });

        return Object.entries(grouped).sort((a, b) =>
            new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );
    }, [messages]);

    const { sendMessage, subscribeToBackend, unsubscribeFromBackend, subscribeToHandler } = useWebSocket();

    useEffect(() => {
        if (open && organizationId && channel.id) {
            subscribeToBackend(channel.id, organizationId, 'project-channel-chat-messages')
            return () => {
                unsubscribeFromBackend(channel.id, organizationId, 'project-channel-chat-messages');
            }
        }
    },)
    function sendTypingEvent(type: boolean) {
        const newTypingdata = {
            user_id: session.user?.id,
            userName: session.user?.name,
            channel_id: channel.id,
            typingEventType: type,
        }
        sendMessage(newTypingdata, channel.id, 'typing-event');
    }

    function handleTyping() {
        if (!typingTimeout) {
            sendTypingEvent(true);
        }
        if (typingTimeout) clearTimeout(typingTimeout);

        const timeOut = setTimeout(() => {
            sendTypingEvent(false);
            setTypingTimeout(null);
        }, 1500)

        setTypingTimeout(timeOut);
    }

    function handleSendMessage(e?: React.FormEvent) {
        if (e) {
            e.preventDefault();
        }

        if (!message.trim()) return;

        if (editingState) {
            const editedMessage = {
                messageId: editingState.messageId,
                message: message.trim()
            };
            sendMessage(editedMessage, channel.id, 'edit-message');
            setEditingState(null);
        } else {
            const newMessage: MessageType = {
                id: uuidv4(),
                org_user_id: Number(session.user?.id) || 0,
                organization_user: {
                    organization_id: organizationId!,
                    role: organizationUser.role,
                    user: session.user as any,
                    user_id: Number(session.user?.id) || 0,
                },
                message: message,
                name: session.user?.name || "User",
                is_deleted: false,
                is_edited: false,
                created_at: new Date(Date.now()),
                LikedUsers: []
            };

            sendMessage(newMessage, channel.id, 'insert-general-channel-message');
            setMessages(prevChats => [...prevChats, newMessage]);
        }
        setMessage("");
    }

    return (
        <UtilitySideBar
            width="5/12"
            open={open}
            setOpen={setOpen}
            content={
                <div className="px-4 py-2 h-full flex flex-col">
                    <DashboardComponentHeading className="ml-2 mt-2" description={project.description!}>{project.title}</DashboardComponentHeading>
                    <div className="w-full flex flex-col relative px-4 py-2 mt-4 rounded-[12px] dark:bg-neutral-800 flex-1">
                        <div className='flex-1 w-full overflow-y-auto scrollbar-hide'>
                            <div className='flex flex-col space-y-5 w-full'>
                                <GroupedByDateMessages channel={channel} groupedMessages={groupedMessages} />
                                <div ref={messagesEndRef} />
                            </div>
                            {!messages.length && <EmptyConversation className="h-full" />}
                        </div>
                        <form className='w-full pb-1' onSubmit={handleSendMessage}>
                            <UserTyping usersTyping={usersTyping} />
                            <div className='flex items-center gap-x-2'>
                                <ChatMessageInput
                                    className="w-full mx-auto"
                                    message={message}
                                    setMessage={setMessage}
                                    handleTyping={handleTyping}
                                    onSendMessage={handleSendMessage}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            }
        />
    )
}