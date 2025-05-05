import Image from "next/image";
import { ChannelType, ProjectChatTypes } from "types/types";
import { format } from 'date-fns'
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { MdEmojiEmotions } from "react-icons/md";
import { useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import OrganizationRolesTickerRenderer from "@/components/utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer";
import ProjectMessageOptionMenu from "./ProjectMessageOptionMenu";
import ProjectchatActivityLogMessage from "./ProjectchatActivityLogMessage";

interface MessagesProps {
    message: ProjectChatTypes;
    className?: string;
    channel: ChannelType;
}

function MessageContent({ message, className, channel }: MessagesProps) {
    const [messageOptionMenu, setOptionMenu] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const isCurrentUser = Number(session.user?.id) === Number(message.user_id);
    return (
        <div className={`flex-shrink-0 flex items-start gap-x-1 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>

            <div className={`space-y-2 mt-1 py-1.5 px-4 z-10 rounded-bl-[8px] rounded-br-[8px] ${isCurrentUser ? "bg-neutral-900 rounded-tl-[8px] text-neutral-300" : "bg-neutral-700 rounded-tr-[8px]"} ${className}`}>
                <p className={` font-light tracking-wider whitespace-pre-wrap break-words ${message.is_deleted ? "text-neutral-400 italic select-none text-[12px]" : "text-[13px]"}`}>
                    {message.message}
                </p>
            </div>
            <div>
                <HiOutlineDotsVertical onClick={() => setOptionMenu(true)} size={14} className={`transition-all text-neutral-200 duration-300 ease-out cursor-pointer  mt-[10px]`} />
                <ProjectMessageOptionMenu channel={channel} isCurrentUser={isCurrentUser} open={messageOptionMenu} setOpen={setOptionMenu} message={message} />
            </div>
        </div>
    );
}

export default function ({ message, channel }: MessagesProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const isCurrentUser = Number(session.user?.id) === Number(message.user_id);

    const handleEmojiClick = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    if (message.is_activity) {
        return <ProjectchatActivityLogMessage message={message} />;
    }

    return (
        <div className={`flex gap-x-2 relative select-none ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} w-full`}>
            <div className="flex-shrink-0 gap-x-1">
                <Image
                    src={message.organization_user?.user.image || "/default-avatar.png"}
                    width={39}
                    height={39}
                    className="rounded-full"
                    alt="user-image"
                />
            </div>

            <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center justify-start gap-x-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[12px] font-semibold flex">{message.name}</span>
                    <span className="text-[11px] tracking-wide font-extralight">
                        {format(new Date(message.created_at), "h:mm a")}
                    </span>
                    <MdEmojiEmotions
                        onClick={handleEmojiClick}
                        size={18}
                        className="text-neutral-900 bg-neutral-600 rounded-[6px] p-[2px] cursor-pointer"
                    />
                    <OrganizationRolesTickerRenderer tickerText={message.organization_user?.role || ""} />
                    {message.is_edited && !message.is_deleted && (
                        <span className="text-[11px] italic font-light">edited</span>
                    )}
                </div>

                {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 z-10">
                        <EmojiPicker height={200} width={200} />
                    </div>
                )}

                <MessageContent channel={channel} message={message} />
            </div>
        </div>
    );
}