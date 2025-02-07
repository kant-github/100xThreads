import Image from "next/image";
import { ChannelType, MessageType } from "types";
import { format } from 'date-fns'
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { MdEmojiEmotions } from "react-icons/md";
import { useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import { HiOutlineDotsVertical } from "react-icons/hi";
import MessageOptionsMenu from "@/components/ui/MessageOptionsMenu";

interface ReactionPayload {
    message_id: string;
    emoji: string;
    user_id: number;
    org_id: number;
    channel: ChannelType;
}

interface MessagesProps {
    message: MessageType;
    className?: string;
    channel: ChannelType;
}

function MessageContent({ message, className, channel }: MessagesProps) {
    const [messageOptionMenu, setOptionMenu] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const isCurrentUser = Number(session.user?.id) === Number(message.org_user_id);
    return (
        <div className={`flex-shrink-0 flex items-start gap-x-1 group ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`space-y-2 mt-1 py-1.5 px-4 z-10 rounded-bl-[8px] rounded-br-[8px] ${isCurrentUser ? "bg-neutral-900 rounded-tl-[8px] text-neutral-300" : "bg-neutral-700 rounded-tr-[8px]"} ${className}`}>
                <p className="text-[12px] font-light tracking-wider whitespace-pre-wrap break-words">
                    {message.message}
                    {message.is_edited && <span>edited</span>}
                </p>
            </div>
            <div>
                <HiOutlineDotsVertical onClick={() => setOptionMenu(true)} size={14} className={`transition-all duration-300 ease-out cursor-pointer opacity-0 group-hover:opacity-100 mt-[10px]`} />
                <MessageOptionsMenu channel={channel} isCurrentUser={isCurrentUser} open={messageOptionMenu} setOpen={setOptionMenu} message={message} />
            </div>
        </div>
    );
}

export default function Message({ message, channel }: MessagesProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const isCurrentUser = Number(session.user?.id) === Number(message.org_user_id);

    const handleEmojiClick = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const onEmojiClick = (emoji: MouseDownEvent) => {
        console.log(emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className={`flex gap-x-2 relative ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} w-full`}>
            <div className="flex-shrink-0 gap-x-1">
                <Image src={message.organization_user?.user.image!} width={36} height={36} className="rounded-full" alt="user-image" />
            </div>
            <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center justify-start gap-x-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[12px] font-semibold flex">{message.name}</span>
                    <span className="text-[11px] tracking-wide font-extralight"> {format(new Date(message.created_at), "h:mm a")}</span>
                    <MdEmojiEmotions onClick={handleEmojiClick} size={18} className={`text-neutral-900 bg-neutral-600 rounded-[6px] p-[2px]`} />
                </div>
                {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 z-10">
                        <EmojiPicker height={200} width={200} onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <MessageContent channel={channel} message={message} />
            </div>
        </div>
    );
}