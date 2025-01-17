import React, { useEffect, useState } from 'react';
import { ChannelType, MessageType } from "types";
import Messages from '../chat/messages/Messages';
import ChatMessageInput from '../chat/ChatMessageInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { generalChatsAtom } from '@/recoil/atoms/chats/generalChatsAtom';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import axios from 'axios';
import { API_URL, BASE_URL } from '@/lib/apiAuthRoutes';

interface OrganizationMessageComponentProps {
    channel: ChannelType
}


export default function ChatInterface({ channel }: OrganizationMessageComponentProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [chats, setChats] = useRecoilState(generalChatsAtom);
    const session = useRecoilValue(userSessionAtom);
    const [message, setMessage] = useState<string>("");
    const organization = useRecoilValue(organizationAtom);
    const channelId = channel.id;
    let lastCursor: string | null = null;
    let isLoading = false;

    async function loadMoreChats() {
        if (isLoading) return;

        setLoading(true);
        try {
            const url = lastCursor
                ? `${API_URL}/organizations/${organization?.id}/channels/${channelId}/chats?cursor=${lastCursor}&pageSize=50`
                : `${API_URL}/organizations/${organization?.id}/channels/${channelId}/chats?pageSize=50`;

            const { data } = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                }
            })
            console.log("data is : ", data.hasMore);

            setChats(prevChats => [...prevChats, ...data.data]);
        } finally {
            isLoading = false;
        }
    }

    useEffect(() => {
        loadMoreChats();
    }, [session.user])

    return (
        <div className="w-full h-full flex flex-col relative px-4"> 
            {/* Messages container with proper overflow handling */}
            <div className='flex-1 w-full overflow-y-auto'>
                <div className='flex flex-col space-y-6'>
                    {chats.map((message) => (
                        <Messages message={message} />
                    ))}
                </div>

            </div>

            {/* Fixed input container at bottom */}
            <div className='w-full py-4'>
                <ChatMessageInput
                    className="w-full mx-auto"
                    message={message}
                    setMessage={setMessage}
                />
            </div>
        </div>
    );
}