import React, { useEffect, useState } from 'react';
import { ChannelType, MessageType } from "types";
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

    const { subscribeToChannel, unsubscribeChannel, sendMessage } = useWebSocket(
        (newMessage: MessageType) => {
            console.log("message came :)");
            setMessages(prevChats => [...prevChats, newMessage]);
        }
    )

    useEffect(() => {
        if (channel.id && organization?.id) {
            console.log("sending subscribe message");
            subscribeToChannel(channel.id, organization.id);
            return () => {
                console.log("sending unsubscribe message");
                unsubscribeChannel(channel.id, organization.id);
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
            message: message,
            name: session.user?.name || "User",
            created_at: new Date(Date.now()),
            LikedUsers: []
        };
        sendMessage(newMessage, channel.id)
        setMessages(prevChats => [...prevChats, newMessage]);
        setMessage("");
    };

    return (
        <div className="w-full h-full flex flex-col relative px-4">
            <div className='flex-1 w-full overflow-y-auto'>
                <div className='flex flex-col space-y-6'>
                    {messages.map((message) => (
                        <Messages key={message.id} message={message} />
                    ))}
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