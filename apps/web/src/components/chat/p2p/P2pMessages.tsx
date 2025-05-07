import Image from "next/image";
import { ChatMessageOneToOneType } from "types/types";
import { format } from 'date-fns'
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { MdEmojiEmotions } from "react-icons/md";
import { useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import OptionImage from "@/components/ui/OptionImage";

interface MessagesProps {
    message: ChatMessageOneToOneType;
    className?: string;
}

function MessageContent({ message, className }: MessagesProps) {
    const [messageOptionMenu, setOptionMenu] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const isCurrentUser = Number(session.user?.id) === Number(message.senderId);
    return (
        <div className={`flex-shrink-0 flex items-start gap-x-1 group ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`space-y-2 mt-1 py-1.5 px-4 z-10 rounded-bl-[8px] rounded-br-[8px] ${isCurrentUser ? "bg-neutral-900 rounded-tl-[8px] text-neutral-300" : "bg-neutral-700 rounded-tr-[8px]"} ${className}`}>
                <p className={` font-light tracking-wider whitespace-pre-wrap break-words ${message.is_deleted ? "text-neutral-400 italic select-none text-[12px]" : "text-[13px]"}`}>
                    {message.content}
                </p>
            </div>
            <div>
                <HiOutlineDotsVertical onClick={() => setOptionMenu(true)} size={14} className={`transition-all duration-300 ease-out cursor-pointer opacity-0 group-hover:opacity-100 mt-[10px]`} />
                {/* <MessageOptionsMenu channel={channel} isCurrentUser={isCurrentUser} open={messageOptionMenu} setOpen={setOptionMenu} message={message} /> */}
            </div>
        </div>
    );
}

export default function ({ message }: MessagesProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const isCurrentUser = Number(session.user?.id) === Number(message.senderId);
    const imageUrl = message.sender?.image;
    console.log(`Rendering message from ${message.senderId}. imageUrl: ${imageUrl}`);
    console.log(`Message ID: ${message.id}, senderId: ${message.senderId}, senderName: ${message.sender?.name}, senderImage: ${message.sender?.image}`)

    const onEmojiClick = () => {
        setShowEmojiPicker(false);
    };

    return (
        <div className={`flex gap-x-2 text-neutral-100 relative select-none ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} w-full`}>
            <div className="flex-shrink-0 gap-x-1">
                <OptionImage
                    userId={message.senderId}
                    content={<Image
                        src={imageUrl}
                        width={39} height={39} className="rounded-full" alt="user-image" />}
                />
            </div>
            <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center justify-start gap-x-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[12px] text-neutral-100 font-semibold flex">{isCurrentUser ? message.sender?.name : message.receiver?.name || 'Unknown User'}</span>
                    <span className="text-[11px] tracking-wide font-extralight"> {format(new Date(message.created_at), "h:mm a")}</span>
                    <MdEmojiEmotions size={18} className={`text-neutral-900 bg-neutral-600 rounded-[6px] p-[2px]`} />
                    {message.is_edited && !message.is_deleted && <span className="text-[11px] italic font-light">edited</span>}
                </div>
                {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 z-10">
                        <EmojiPicker height={200} width={200} onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <MessageContent message={message} />
            </div>
        </div>
    );
}