import React, {  useState } from 'react';
import { ChannelType, MessageType } from "types";
import Messages from '../chat/messages/Messages';
import ChatMessageInput from '../chat/ChatMessageInput';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';

interface OrganizationMessageComponentProps {
    channel: ChannelType;
    initialChats: MessageType[]
}


export default function ChatInterface({ channel, initialChats }: OrganizationMessageComponentProps) {
    const [messages, setMessages] = useState<MessageType[]>(initialChats);
    const session = useRecoilValue(userSessionAtom);
    const [message, setMessage] = useState<string>("");
    const organization = useRecoilValue(organizationAtom);
    const channelId = channel.id;

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

        setMessages(prevChats => [...prevChats, newMessage]);
        setMessage("");
    };

    return (
        <div className="w-full h-full flex flex-col relative px-4">
            <div className='flex-1 w-full overflow-y-auto'>
                <div className='flex flex-col space-y-6'>
                    {messages.map((message) => (
                        <Messages message={message} />
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