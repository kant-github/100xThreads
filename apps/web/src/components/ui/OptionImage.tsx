import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import UtilityMiniSideBar from '../utility/UtilityMiniSideBar';
import axios from 'axios';
import { USER_URL } from '@/lib/apiAuthRoutes';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { OrganizationUsersType } from 'types/types';
import WhiteText from '../heading/WhiteText';
import { BsTextParagraph } from 'react-icons/bs';
import { IoIosCheckmarkCircleOutline, IoMdMail } from 'react-icons/io';
import DesignButton from '../buttons/DesignButton';
import OrganizationRolesTickerRenderer from '../utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer';
import { useWebSocket } from '@/hooks/useWebsocket';

interface OptionImageProps {
    content: any
    imageClassName?: string;
    organizationId: string;
    userId: number;
}

const OptionImage: React.FC<OptionImageProps> = ({ organizationId, userId, content }) => {
    const [open, setOpen] = useState(false);
    const session = useRecoilValue(userSessionAtom);
    const [organizationUser, setOrganizationUser] = useState<OrganizationUsersType>({} as OrganizationUsersType);
    const [isFriend, setIsFriend] = useState<boolean>(false);
    const { sendMessage, subscribeToBackend, subscribeToHandler, unsubscribeFromBackend } = useWebSocket();

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
            })
            setOrganizationUser(data.data);
            setIsFriend(data.isFriend);
        } catch (err) {
            console.log("Error in fetching user profile details");
        }
    }

    function incomingFriendRequestHandler(newMessage: any) {
        console.log("new message is : ", newMessage);
    }

    useEffect(() => {
        if (session && organizationId && userId && open) {
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
        if (organizationUser.id) {
            const payload = {
                friendsId: Number(organizationUser.user.id)
            }
            sendMessage(payload, String(organizationUser.user.id), 'send-friend-request');
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
                    <div className='flex flex-col gap-y-1.5 px-8 py-6'>
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
                            {!isFriend ?
                                <DesignButton onClick={sendFriendRequestHandler}>Add Friend</DesignButton> :
                                <DesignButton onClick={sendFriendRequestHandler}>Chat</DesignButton>
                            }
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