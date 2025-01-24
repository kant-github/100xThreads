import React, { useEffect, useRef, useState } from 'react';
import { ChannelType, MessageType, UserRole, UserType } from "types";
import Messages from '../chat/messages/Messages';
import ChatMessageInput from '../chat/ChatMessageInput';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import { useWebSocket } from '@/hooks/useWebsocket';

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
            const unsubscribe = subscribeToChannel(channel.id, organization.id, 'insert-general-channel-message', handleIncomingMessage);

            return () => {
                unsubscribe();
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
                <div className='flex flex-col space-y-6'>
                    {messages.map((message) => (
                        <Messages key={message.id} message={message} />
                    ))}
                </div>
                <div ref={messagesEndRef} />
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