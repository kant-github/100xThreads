import { useEffect, useState } from 'react';
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import UtilityCard from "@/components/utility/UtilityCard";
import { ChannelType, MessageType } from "types";
import OrganizationMessageComponent from "../OrganizationMessageComponent";
import { useRecoilState, useRecoilValue } from 'recoil';
import { generalChatsAtom } from '@/recoil/atoms/chats/generalChatsAtom';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';
import axios from 'axios';
import { API_URL } from '@/lib/apiAuthRoutes';

interface WelcomeChannelViewProps {
    channel: ChannelType;
}

export default function WelcomeChannelView({ channel }: WelcomeChannelViewProps) {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useRecoilState<MessageType[]>(generalChatsAtom);
    const session = useRecoilValue(userSessionAtom);
    const organization = useRecoilValue(organizationAtom);
    let lastCursor: string | null = null;

    useEffect(() => {
        const fetchInitialChats = async () => {
            setLoading(true);
            try {
                const url = lastCursor ? `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/chats?cursor=${lastCursor}&pageSize=50` : `${API_URL}/organizations/${organization?.id}/channels/${channel.id}/chats?pageSize=50`;
                const { data } = await axios.get(url,
                    {
                        headers: {
                            authorization: `Bearer ${session.user?.token}`,
                        }
                    }
                );
                setChats(data.data);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialChats();

        return () => {
            setChats([]);
        };
    }, [channel.id, session.user]);

    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative">
            <DashboardComponentHeading description={channel.description!}>
                {channel.title} / Water cooler
            </DashboardComponentHeading>
            <UtilityCard className="w-full flex-grow mt-4 overflow-hidden">
                {loading ? (
                    <div className="p-4 space-y-4">
                        loading
                    </div>
                ) : (
                    <OrganizationMessageComponent
                        channel={channel}
                        initialChats={chats}
                    />
                )}
            </UtilityCard>
        </div>
    );
}