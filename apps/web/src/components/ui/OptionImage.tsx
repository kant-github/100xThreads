import React, { useEffect, useState } from 'react';
import UtilityMiniSideBar from '../utility/UtilityMiniSideBar';
import axios from 'axios';
import { USER_URL } from '@/lib/apiAuthRoutes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { OrganizationUsersType, UserRole } from 'types/types';
import { useWebSocket } from '@/hooks/useWebsocket';
import { useNotificationWebSocket } from '@/hooks/useNotificationWebsocket';
import { userProfileAtom } from '@/recoil/atoms/users/userProfileAtom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { dashboardOptionsAtom, RendererOption } from '@/recoil/atoms/DashboardOptionsAtom';
import { settingsOptionAtom, settingsOptionEnum } from '@/recoil/atoms/SettingsOptionAtom';
import OptionImagecontent from './OptionImagecontent';
import OptionImageSkeleton from '../skeletons/OptionImageSkeleton';

interface OptionImageProps {
    content: any
    imageClassName?: string;
    organizationId?: string;
    userId: number;
}

export default function ({ organizationId, userId, content }: OptionImageProps) {
    const [open, setOpen] = useState(false);
    const session = useRecoilValue(userSessionAtom);
    const userProfileData = useRecoilValue(userProfileAtom);
    const [organizationUser, setOrganizationUser] = useState<OrganizationUsersType>({} as OrganizationUsersType);
    const [friendshipStatus, setFriendshipStatus] = useState<string>("");
    const [friendRequestId, setFriendRequestId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { subscribeToBackend, subscribeToHandler, unsubscribeFromBackend } = useWebSocket();
    const { sendMessage: sendNotificationMessage } = useNotificationWebSocket();
    const setSettingsAtom = useSetRecoilState(settingsOptionAtom);
    const setDashboardAtom = useSetRecoilState(dashboardOptionsAtom);

    const router = useRouter();
    function handleContentClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setOpen(prev => !prev);
    };

    async function fetchUserProfileData() {
        try {
            setLoading(true);
            const { data } = await axios.get(`${USER_URL}/profile-data/${organizationId}/${userId}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                },
            });

            let normalizedData: OrganizationUsersType;

            if (organizationId) {
                normalizedData = data.data;
            } else {
                const userData = data.data;
                // @ts-ignore
                normalizedData = {
                    id: userData.id,
                    user: userData,
                    organization: undefined,
                    role: UserRole.OBSERVER,
                };
            }

            setOrganizationUser(normalizedData);
            setFriendshipStatus(data.friendshipStatus);
            setFriendRequestId(data.friendRequestId);
        } catch (err) {
            console.log("Error in fetching user profile details");
        }
        finally {
            setLoading(false);
        }
    }


    function incomingFriendRequestHandler() {
    }

    useEffect(() => {
        if (session && userId && open) {
            fetchUserProfileData();
        }
    }, [open, session?.user?.token, organizationId, userId])

    useEffect(() => {
        if (organizationUser && organizationUser.user) {
            subscribeToBackend(String(organizationUser.user.id), 'friends', 'send-friend-request')
            const unsubscribeSendFriendRequestHandler = subscribeToHandler('send-friend-request', incomingFriendRequestHandler);

            return () => {
                unsubscribeFromBackend(String(organizationUser.user.id), 'friends', 'send-friend-request');
                unsubscribeSendFriendRequestHandler();
            }
        }
    }, [organizationUser])

    function sendFriendRequestHandler() {
        if (organizationUser.user.id, session.user?.id) {

            const payload = {
                friendsId: Number(organizationUser.user.id),
                userId: Number(session.user.id)
            }
            sendNotificationMessage('send-friend-request', 'global', payload);
        }
    }

    function friendRequestAcceptHandler() {
        if (!friendRequestId) return;
        const newMessage = {
            friendRequestId: friendRequestId,
            type: 'accept-friend-request'
        };
        sendNotificationMessage('accept-friend-request', 'global', newMessage);
        setFriendshipStatus('FRIENDS');
    }

    function startChatHandler() {

        if (!organizationUser.user.username && !userProfileData.username) {
            toast(`Both users should set thier usernames`, {
                action: {
                    label: "Set yours now",
                    onClick: () => {
                        router.push("/dashboard");
                        setDashboardAtom(RendererOption.Settings);
                        setSettingsAtom(settingsOptionEnum.Profile)
                    },
                },
            });
        }
        else if (!organizationUser.user.username) {
            toast.error(`${organizationUser.user.name} has not set thier username`);
        }
        else if (!userProfileData.username) {
            toast(`${userProfileData.name}, please set your username`, {
                action: {
                    label: "Set Now",
                    onClick: () => {
                        router.push("/dashboard");
                        setDashboardAtom(RendererOption.Settings);
                        setSettingsAtom(settingsOptionEnum.Profile)
                    },
                },
            });
        }
        else {
            router.push(`/chat/${organizationUser.user.username}`)
        }
    }

    return (
        <div className="relative">
            <div className="cursor-pointer" onClick={handleContentClick}>
                {content}
            </div>

            <UtilityMiniSideBar
                open={open}
                setOpen={setOpen}
                content={
                    loading ? <OptionImageSkeleton /> : <OptionImagecontent friendRequestAcceptHandler={friendRequestAcceptHandler} friendshipStatus={friendshipStatus} startChatHandler={startChatHandler} sendFriendRequestHandler={sendFriendRequestHandler} organizationUser={organizationUser} />
                }
            />
        </div>
    );
};