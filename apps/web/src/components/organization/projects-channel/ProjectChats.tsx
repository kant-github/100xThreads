import ChatMessageInput from "@/components/chat/ChatMessageInput";
import { useWebSocket } from "@/hooks/useWebsocket";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { messageEditingState } from "@/recoil/atoms/chats/messageEditingStateAtom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { v4 as uuidv4 } from "uuid";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChannelType, ProjectChatTypes, ProjectTypes } from "types/types";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import UserTyping from "@/components/utility/UserTyping";
import EmptyConversation from "@/components/chat/EmptyConversation";
import ProjectChatsGroupedByDate from "./ProjectChatsGroupedByDate";

interface ProjectChatsProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    project: ProjectTypes;
    channel: ChannelType;
    chats: ProjectChatTypes[];
}

export default function ({ open, project, channel, chats }: ProjectChatsProps) {
    const [message, setMessage] = useState<string>('');
    const session = useRecoilValue(userSessionAtom);
    const organizationId = useRecoilValue(organizationIdAtom);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [editingState, setEditingState] = useRecoilState(messageEditingState);
    const [messages, setMessages] = useState<ProjectChatTypes[]>(chats);
    const organizationUser = useRecoilValue(organizationUserAtom);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(chats);
    }, [chats]);

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    useEffect(() => {
        if (editingState) {
            setMessage(editingState.originalMessage);
        } else {
            setMessage('');
        }
    }, [editingState])

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const groupedMessages = useMemo(() => {
        const grouped: { [key: string]: ProjectChatTypes[] } = {};

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

    function handleIncomingMessageEvents(newMessage: any) {
        setMessages(prev => [...prev, newMessage]);
    }

    function handleIncomingTypingEvents(newMessage: any) {
        console.log(newMessage);
        const { userName, typingEventType, project_id: incomingProjectID } = newMessage;

        if (project.id === incomingProjectID) {
            setUsersTyping(prevUsers => {
                if (typingEventType && !prevUsers.includes(userName)) {
                    return [...prevUsers, userName];
                } else if (!typingEventType) {
                    return prevUsers.filter(user => user !== userName);
                }
                return prevUsers;
            });
        }
    }

    function handleIncomingDeleteMessage(newMessage: any) {
        console.log("delete message is : ", newMessage);
        setMessages((prevMessage) => {
            return prevMessage.map((message) => {
                if (message.id === newMessage.id) {
                    console.log("message id is : ", message.id);
                    console.log("new message id is : ", newMessage.id);
                    return {
                        ...message,
                        message: newMessage.message,
                        is_deleted: true,
                        deleted_at: newMessage.deleted_at
                    }
                }
                return message;
            })
        })
    }

    function handleIncomingEditMessage(newMessage: any) {
        console.log("new edited message recieved is : ", newMessage);
        setMessages((prevMessages) => {
            return prevMessages.map((message) => {
                if (message.id === newMessage.id) {
                    return {
                        ...message,
                        message: newMessage.message,
                        is_edited: true,
                        edited_at: newMessage.edited_at
                    }
                }
                return message
            })
        })
    }


    useEffect(() => {
        if (open && organizationId && channel.id) {
            console.log("sending a subscribe event");

            subscribeToBackend(channel.id, organizationId, 'project-channel-chat-messages');
            subscribeToBackend(channel.id, organizationId, 'project-chat-delete-message');
            subscribeToBackend(channel.id, organizationId, 'project-chat-edit-message');
            subscribeToBackend(channel.id, organizationId, 'project-chat-typing-events');
            const unsubscribeTypingEventHandler = subscribeToHandler('project-chat-typing-events', handleIncomingTypingEvents);
            const unsubscribeIncomingMessageHandler = subscribeToHandler('project-channel-chat-messages', handleIncomingMessageEvents);
            const unsubscribeDeleteMessageHandler = subscribeToHandler('project-chat-delete-message', handleIncomingDeleteMessage);
            const unsubscribeEditMessageHandler = subscribeToHandler('project-chat-edit-message', handleIncomingEditMessage);
            return () => {
                unsubscribeIncomingMessageHandler();
                unsubscribeTypingEventHandler();
                unsubscribeDeleteMessageHandler();
                unsubscribeEditMessageHandler();
                unsubscribeFromBackend(channel.id, organizationId, 'project-channel-chat-messages');
                unsubscribeFromBackend(channel.id, organizationId, 'project-chat-delete-message');
                unsubscribeFromBackend(channel.id, organizationId, 'project-chat-edit-message');
                unsubscribeFromBackend(channel.id, organizationId, 'project-chat-typing-events');
            }
        }
    }, [open, channel.id, organizationId])
    function sendTypingEvent(type: boolean) {
        const newTypingdata = {
            user_id: session.user?.id,
            userName: session.user?.name,
            project_id: project.id,
            channel_id: channel.id,
            typingEventType: type,
        }
        sendMessage(newTypingdata, channel.id, 'project-chat-typing-events');
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
            sendMessage(editedMessage, channel.id, 'project-chat-edit-message');
            setEditingState(null);
        } else {
            const newMessage: ProjectChatTypes = {
                id: uuidv4(),
                org_user_id: Number(session.user?.id) || 0,
                organization_user: {
                    organization_id: organizationId!,
                    role: organizationUser.role,
                    user: session.user as any,
                    user_id: Number(session.user?.id) || 0,
                },
                project_id: project.id,
                message: message,
                name: session.user?.name || "User",
                is_deleted: false,
                is_edited: false,
                created_at: new Date(Date.now()),
                LikedUsers: []
            };

            sendMessage(newMessage, channel.id, 'project-channel-chat-messages');
            setMessages(prevChats => [...prevChats, newMessage]);
        }
        setMessage("");
    }

    return (
        <div className="h-full flex flex-col relative px-4 py-2 mt-4 rounded-[12px] dark:bg-neutral-800/60">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col space-y-5 w-full min-h-0">
                    <ProjectChatsGroupedByDate
                        channel={channel}
                        groupedMessages={groupedMessages}
                    />

                    <div ref={messagesEndRef} />
                </div>
                {!messages.length && <EmptyConversation className="h-full" />}
            </div>
            <form className="w-full mt-4" onSubmit={handleSendMessage}>
                <UserTyping usersTyping={usersTyping} />
                <div className="flex items-center gap-x-2">
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
    )
}