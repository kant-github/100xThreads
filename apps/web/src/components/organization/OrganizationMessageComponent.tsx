import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ChannelType, MessageType } from "types/types";
import ChatMessageInput from '../chat/ChatMessageInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { useWebSocket } from '@/hooks/useWebsocket';
import EmptyConversation from '../chat/EmptyConversation';
import GroupedByDateMessages from '../chat/messages/GroupedByDateMessages';
import UserTyping from '../utility/UserTyping';
import PollCard from '../chat/polls/PollCard';
import { GoPaperclip } from "react-icons/go";
import { v4 as uuidv4 } from "uuid";
import { messageEditingState } from '@/recoil/atoms/chats/messageEditingStateAtom';
import { organizationUserAtom } from '@/recoil/atoms/organizationAtoms/organizationUserAtom';

interface OrganizationMessageComponentProps {
    channel: ChannelType;
    initialChats: MessageType[];
}

export default function ChatInterface({ channel, initialChats }: OrganizationMessageComponentProps) {
    const [messages, setMessages] = useState<MessageType[]>(initialChats);
    const session = useRecoilValue(userSessionAtom);
    const organizationUser = useRecoilValue(organizationUserAtom);
    const [message, setMessage] = useState<string>("");
    const organization = useRecoilValue(organizationAtom);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const [pollCreationCard, setPollCreationCard] = useState<boolean>(false);
    const [editingState, setEditingState] = useRecoilState(messageEditingState);
    console.log("organizayion user is : ", organizationUser);
    useEffect(() => {
        if (editingState) {
            setMessage(editingState.originalMessage);
        } else {
            setMessage('');
        }
    }, [editingState])

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

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const { subscribeToBackend, unsubscribeFromBackend, subscribeToHandler, sendMessage } = useWebSocket();

    function handleIncomingMessage(newMessage: MessageType) {
        setMessages(prev => [...prev, newMessage]);
    }

    function handleIncomingTypingEvents(newMessage: any) {
        const { userName, typingEventType } = newMessage;
        setUsersTyping(prevUsers => {
            if (typingEventType && !prevUsers.includes(userName)) {
                return [...prevUsers, userName];
            } else if (!typingEventType) {
                return prevUsers.filter(user => user !== userName);
            }
            return prevUsers;
        });
    }

    function handleIncomingDeleteMessage(newMessage: any) {
        setMessages((prevMessage) => {
            return prevMessage.map((message) => {
                if (message.id === newMessage.id) {
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

        if (channel.id && organization?.id) {

            subscribeToBackend(channel.id, organization.id, 'typing-event');
            subscribeToBackend(channel.id, organization.id, 'insert-general-channel-message')
            subscribeToBackend(channel.id, organization.id, 'delete-message');
            subscribeToBackend(channel.id, organization.id, 'edit-message');
            const unsubscribeTypingEventHandler = subscribeToHandler('typing-event', handleIncomingTypingEvents);
            const unsubscribeMessageHandler = subscribeToHandler('insert-general-channel-message', handleIncomingMessage);
            const unsubscribeDeleteMessageHandler = subscribeToHandler('delete-message', handleIncomingDeleteMessage);
            const unsubscribeEditMessageHandler = subscribeToHandler('edit-message', handleIncomingEditMessage);
            return () => {
                unsubscribeTypingEventHandler();
                unsubscribeMessageHandler();
                unsubscribeDeleteMessageHandler();
                unsubscribeEditMessageHandler();
                unsubscribeFromBackend(channel.id, organization.id, 'insert-general-channel-message');
                unsubscribeFromBackend(channel.id, organization.id, 'typing-event');
                unsubscribeFromBackend(channel.id, organization.id, 'delete-message');
                unsubscribeFromBackend(channel.id, organization.id, 'edit-message');
            }

        }
    }, [channel.id, organization?.id])

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
                message: message,
                name: session.user?.name!,
                created_at: new Date(Date.now()),
                channel_id: channel.id,
                is_deleted: false,
                is_edited: false,
                org_user_id: organizationUser.user_id,
                organization_user: organizationUser,
                LikedUsers: []
            };

            setMessages(prev => [...prev, newMessage]);
            sendMessage(newMessage, channel.id, 'insert-general-channel-message');
        }
        setMessage("");
    }

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
        }, 1500);

        setTypingTimeout(timeOut);
    }

    return (
        <div className="w-full h-full flex flex-col relative px-4 py-2">
            <div className='flex-1 w-full overflow-y-auto scrollbar-hide'>
                <div className='flex flex-col space-y-5 w-full'>
                    <GroupedByDateMessages channel={channel} groupedMessages={groupedMessages} />
                    <div ref={messagesEndRef} />
                </div>
                <PollCard channel={channel} pollCreationCard={pollCreationCard} setPollCreationCard={setPollCreationCard} />
                {!messages.length && <EmptyConversation className="h-full" />}
            </div>
            <form className='w-full pb-1' onSubmit={handleSendMessage}>
                <UserTyping usersTyping={usersTyping} />
                <div className='flex items-center gap-x-2'>
                    <button onClick={() => setPollCreationCard(prev => !prev)} type='button' aria-label='options' className='p-3 dark:bg-neutral-900 rounded-[8px]'>
                        <GoPaperclip size={17} className='text-neutral-400' />
                    </button>
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
    );
}