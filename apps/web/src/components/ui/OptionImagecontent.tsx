import { IoIosCheckmarkCircleOutline, IoMdMail } from "react-icons/io";
import WhiteText from "../heading/WhiteText";
import { BsTextParagraph } from "react-icons/bs";
import DesignButton from "../buttons/DesignButton";
import FriendsTicker from "../utility/tickers/FriendsTicker";
import OrganizationRolesTickerRenderer from "../utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer";
import Image from "next/image";
import { OrganizationUsersType } from "types/types";

interface OptionImageContentProps {
    friendshipStatus: string;
    startChatHandler: () => void;
    sendFriendRequestHandler: () => void;
    friendRequestAcceptHandler: () => void;
    organizationUser: OrganizationUsersType;
}

export default function ({ friendshipStatus, sendFriendRequestHandler, organizationUser, startChatHandler, friendRequestAcceptHandler }: OptionImageContentProps) {
    return (
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
                        <DesignButton onClick={startChatHandler}>Chat</DesignButton>
                    </div>

                ) : friendshipStatus.startsWith("REQUEST_RECEIVED") ? (
                    <div className="mt-2 flex items-center justify-center w-full space-x-3">
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
    )
}