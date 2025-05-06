import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import UtilityMiniSideBar from '../utility/UtilityMiniSideBar';
import axios from 'axios';
import { USER_URL } from '@/lib/apiAuthRoutes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { OrganizationUsersType, UserRole } from 'types/types';
import WhiteText from '../heading/WhiteText';
import { BsTextParagraph } from 'react-icons/bs';
import { IoIosCheckmarkCircleOutline, IoMdMail } from 'react-icons/io';
import DesignButton from '../buttons/DesignButton';
import OrganizationRolesTickerRenderer from '../utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer';
import { useWebSocket } from '@/hooks/useWebsocket';
import { useNotificationWebSocket } from '@/hooks/useNotificationWebsocket';
import FriendsTicker from '../utility/tickers/FriendsTicker';
import { userProfileAtom } from '@/recoil/atoms/users/userProfileAtom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { dashboardOptionsAtom, RendererOption } from '@/recoil/atoms/DashboardOptionsAtom';
import { settingsOptionAtom, settingsOptionEnum } from '@/recoil/atoms/SettingsOptionAtom';

interface OptionImageProps {
    content: any
    imageClassName?: string;
    organizationId?: string;
    userId: number;
}

const OptionImage: React.FC<OptionImageProps> = ({ organizationId, userId, content }) => {
    const [open, setOpen] = useState(false);
    const session = useRecoilValue(userSessionAtom);
    const userProfileData = useRecoilValue(userProfileAtom);
    const [organizationUser, setOrganizationUser] = useState<OrganizationUsersType>({} as OrganizationUsersType);
    const [friendshipStatus, setFriendshipStatus] = useState<string>("");
    const [friendRequestId, setFriendRequestId] = useState<string>("");
    const { subscribeToBackend, subscribeToHandler, unsubscribeFromBackend } = useWebSocket();
    const { sendMessage: sendNotificationMessage } = useNotificationWebSocket();
    const setSettingsAtom = useSetRecoilState(settingsOptionAtom);
    const setDashboardAtom = useSetRecoilState(dashboardOptionsAtom);

    const router = useRouter();
    function handleImageClick(e: React.MouseEvent) {
        e.stopPropagation();
        setOpen(prev => !prev);
    };

    async function fetchUserProfileData() {
        try {
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

    function friendRequestAcceptHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        if (!friendRequestId) return;
        const newMessage = {
            friendRequestId: friendRequestId,
            type: 'accept-friend-request'
        };
        sendNotificationMessage('accept-friend-request', 'global', newMessage);
        setFriendshipStatus('FRIENDS');
    }

    function startchatHandler() {

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
            <div className="cursor-pointer" onClick={handleImageClick}>
                {content}
            </div>

            <UtilityMiniSideBar
                open={open}
                setOpen={setOpen}
                content={
                    <div className='flex flex-col gap-y-1.5 px-8 py-6 z-[100]'>
                        <div className='flex items-center justify-center gap-x-2'>
                            {organizationUser.user?.image && (
                                <Image
                                    src={organizationUser.user?.image}
                                    alt={`${organizationUser.user?.name}'s image`}
                                    height={46}
                                    width={46}
                                    className='rounded-full'
                                />
                            )}
                        </div>
                        <div className="flex flex-row justify-center items-center gap-x-2">
                            <div className="text-lg font-medium">{organizationUser.user?.name}</div>
                            <div className="flex items-center gap-x-1 text-green-500 text-[11px] "><IoIosCheckmarkCircleOutline size={14} /> {" "} Active</div>
                        </div>
                        <WhiteText className="text-xs flex justify-center">Delhi, India</WhiteText>
                        <div className='flex items-center justify-center gap-x-2'>
                            <WhiteText className="text-xs flex justify-center">{organizationUser.organization?.name}</WhiteText>
                            <OrganizationRolesTickerRenderer tickerText={organizationUser.role} />
                        </div>
                        <div className='flex items-end justify-center gap-x-2'>
                            {friendshipStatus === "FRIENDS" ? (
                                <div className="flex items-center justify-center gap-x-3">
                                    <FriendsTicker />
                                    <DesignButton onClick={startchatHandler}>Chat</DesignButton>
                                </div>

                            ) : friendshipStatus.startsWith("REQUEST_RECEIVED") ? (
                                <div className="mt-2 flex w-full space-x-3">
                                    <button type="button" className="px-4 py-2 bg-yellow-600 text-white text-xs font-medium rounded-[4px] hover:bg-yellow-600/80 transition-colors" onClick={friendRequestAcceptHandler}>
                                        Accept
                                    </button>
                                    <button type="button" className="px-4 py-2 bg-gray-200 text-gray-800 text-xs font-medium rounded-[4px] hover:bg-gray-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                                        Decline
                                    </button>
                                </div>
                            ) : friendshipStatus.startsWith("REQUEST_SENT") ? (
                                <DesignButton disabled>Request Sent</DesignButton>
                            ) : (
                                <DesignButton onClick={sendFriendRequestHandler}>Add Friend</DesignButton>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-y-2 justify-center gap-x-4 mt-3">
                            <WhiteText className="text-xs px-3 py-1 rounded-[4px] border-[1px] border-zinc-600 flex items-center justify-center gap-x-2">
                                <IoMdMail />
                                {organizationUser.user?.email}
                            </WhiteText>
                            <WhiteText className="text-xs px-3 py-1 rounded-[4px] border-[1px] border-zinc-600 flex items-center gap-x-2">
                                <BsTextParagraph />
                                {"faraaz aao sitaare safar ke dekhte hain 🌻"}
                            </WhiteText>
                        </div>
                        <div className="flex items-start justify-center gap-x-4 mt-3">
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default OptionImage;