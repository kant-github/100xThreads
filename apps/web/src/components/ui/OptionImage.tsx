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
import { IoMdMail } from 'react-icons/io';
import DesignButton from '../buttons/DesignButton';
import OrganizationRolesTickerRenderer from '../utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer';

interface OptionImageProps {
    image: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
    };
    imageClassName?: string;
    organizationId: string;
    userId: number;
}

const OptionImage: React.FC<OptionImageProps> = ({ image, imageClassName, organizationId, userId }) => {
    const [open, setOpen] = useState(false);
    const session = useRecoilValue(userSessionAtom);
    const [organizationUser, setOrganizationUser] = useState<OrganizationUsersType>({} as OrganizationUsersType);

    const handleImageClick = () => {
        setOpen(prev => !prev);
    };

    async function fetchUserProfileData() {
        try {
            const { data } = await axios.get(`${USER_URL}/profile-data/${organizationId}/${userId}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                },
            })
            console.log("profile data is : ", data.data);
            setOrganizationUser(data.data);
        } catch (err) {
            console.log("Error in fetching user profile details");
        }
    }

    useEffect(() => {
        if (session && organizationId && userId && open) {
            fetchUserProfileData();
        }
    }, [open, session?.user?.token, organizationId, userId])

    return (
        <div className="relative inline-block">
            <div className="cursor-pointer transition-transform hover:scale-105" onClick={handleImageClick}>
                <Image
                    src={image.src}
                    alt={image.alt || 'Option image'}
                    width={image.width || 64}
                    height={image.height || 64}
                    className={`object-cover ${imageClassName}`}
                />
            </div>

            <UtilityMiniSideBar
                open={open}
                setOpen={setOpen}
                content={
                    <div className='flex flex-col px-8 py-6'>
                        <div className='flex items-center justify-center'>
                            <Image
                                src={organizationUser.user?.image}
                                alt={`${organizationUser.user?.name}'s image`}
                                height={46}
                                width={46}
                                className='rounded-full'
                            />
                        </div>
                        <div className='flex items-center justify-center gap-x-2'>
                            <DesignButton>Add Friend</DesignButton>
                            <OrganizationRolesTickerRenderer tickerText={organizationUser.role} />
                        </div>
                        <div className="flex items-start justify-center gap-x-4 mt-3">
                            <WhiteText className="text-xs px-3 py-1 rounded-[4px] border-[1px] border-zinc-600 flex items-center gap-x-2">
                                <IoMdMail />
                                {session.user?.email}
                            </WhiteText>
                            <WhiteText className="text-xs px-3 py-1 rounded-[4px] border-[1px] border-zinc-600 flex items-center gap-x-2">
                                <BsTextParagraph />
                                {"faraaz aao sitaare safar ke dekhte hain 🌻"}
                            </WhiteText>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default OptionImage;