import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ChannelType, MessageType, UserRole } from "types";
import ChatMessageInput from '../chat/ChatMessageInput';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { useWebSocket } from '@/hooks/useWebsocket';
import EmptyConversation from '../chat/EmptyConversation';
import GroupedByDateMessages from '../chat/messages/GroupedByDateMessages';
import UserTyping from '../utility/UserTyping';
import PollCard from '../chat/polls/PollCard';
import { GoPaperclip } from "react-icons/go";
import PollCreationCard from '../chat/polls/PollCreationCard';

interface OrganizationMessageComponentProps {
    channel: ChannelType;
    initialChats: MessageType[];
}

export default function ChatInterface({ channel, initialChats }: OrganizationMessageComponentProps) {
    const [messages, setMessages] = useState<MessageType[]>(initialChats);
    const session = useRecoilValue(userSessionAtom);
    const [message, setMessage] = useState<string>("");
    const organization = useRecoilValue(organizationAtom);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const [pollCreationCard, setPollCreationCard] = useState<boolean>(false);


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

    useEffect(() => {

        if (channel.id && organization?.id) {
            console.log("subscribing");

            subscribeToBackend(channel.id, organization.id, 'typing-event');
            subscribeToBackend(channel.id, organization.id, 'insert-general-channel-message')
            const unsubscribeTypingEventHandler = subscribeToHandler('typing-event', handleIncomingTypingEvents);
            const unsubscribeMessageHandler = subscribeToHandler('insert-general-channel-message', handleIncomingMessage);

            return () => {
                unsubscribeTypingEventHandler();
                unsubscribeMessageHandler();
                unsubscribeFromBackend(channel.id, organization.id, 'insert-general-channel-message');
                unsubscribeFromBackend(channel.id, organization.id, 'typing-event');
            }

        }
    }, [channel.id, organization?.id])

    function handleSendMessage(e?: React.FormEvent) {
        if (e) {
            e.preventDefault();
        }

        if (!message.trim()) return;

        const newMessage: MessageType = {
            id: Date.now().toString(),
            org_user_id: Number(session.user?.id) || 0,
            organization_user: {
                organization_id: organization?.id!,
                role: UserRole.MEMBER,
                user: session.user as any,
                user_id: Number(session.user?.id) || 0,
            },
            message: message,
            name: session.user?.name || "User",
            created_at: new Date(Date.now()),
            LikedUsers: []
        };

        sendMessage(newMessage, channel.id, 'insert-general-channel-message');
        setMessages(prevChats => [...prevChats, newMessage]);
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
                    <EmptyConversation className="mt-4 w-full" show={messages.length === 0} />
                    <GroupedByDateMessages groupedMessages={groupedMessages} />
                    <div ref={messagesEndRef} />
                </div>
                {/* <PollCard channel={channel} pollCreationCard={pollCreationCard} setPollCreationCard={setPollCreationCard} /> */}
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