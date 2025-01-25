import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ChannelType, MessageType, UserRole } from "types";
import ChatMessageInput from '../chat/ChatMessageInput';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { useWebSocket } from '@/hooks/useWebsocket';
import EmptyConversation from '../chat/EmptyConversation';
import GroupedByDateMessages from '../chat/messages/GroupedByDateMessages';

interface OrganizationMessageComponentProps {
    channel: ChannelType;
    initialChats: MessageType[]
}

export default function ChatInterface({ channel, initialChats }: OrganizationMessageComponentProps) {
    const [messages, setMessages] = useState<MessageType[]>(initialChats);
    const session = useRecoilValue(userSessionAtom);
    const [message, setMessage] = useState<string>("");
    const organization = useRecoilValue(organizationAtom);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

    console.log("grouped messages : ", groupedMessages);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const { subscribeToChannel, unsubscribeChannel, sendMessage } = useWebSocket();

    function handleIncomingMessage(newMessage: MessageType) {
        setMessages(prev => [...prev, newMessage]);
    }

    useEffect(() => {

        if (channel.id && organization?.id) {
            const unsubscribeMessageTransmission = subscribeToChannel(
                channel.id,
                organization.id,
                'insert-general-channel-message',
                handleIncomingMessage
            );

            return () => {
                unsubscribeMessageTransmission();
                unsubscribeChannel(channel.id, organization.id, 'insert-general-channel-message');
            }

        }
    }, [channel.id, organization?.id])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage: MessageType = {
            id: Date.now().toString(),
            channel_id: channel.id,
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

        sendMessage(newMessage, channel.id, 'insert-general-channel-message')
        setMessages(prevChats => [...prevChats, newMessage]);
        setMessage("");
    };

    return (
        <div className="w-full h-full flex flex-col relative px-4">
            <div className='flex-1 w-full overflow-y-auto scrollbar-hide'>
                <div className='flex flex-col space-y-7 w-full'>
                    <EmptyConversation className="mt-4 w-full" show={messages.length === 0} />
                    <GroupedByDateMessages groupedMessages={groupedMessages} />
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form className='w-full py-4' onSubmit={handleSendMessage}>
                <ChatMessageInput
                    className="w-full mx-auto"
                    message={message}
                    setMessage={setMessage}
                />
            </form>
        </div>
    );
}