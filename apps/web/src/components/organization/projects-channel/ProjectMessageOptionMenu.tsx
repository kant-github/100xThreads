import { useWebSocket } from "@/hooks/useWebsocket";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ChannelType, ProjectChatTypes } from "types/types";
import { motion, AnimatePresence } from "framer-motion";
import { useSetRecoilState } from "recoil";
import { messageEditingState } from "@/recoil/atoms/chats/messageEditingStateAtom";
import { useToast } from "@/hooks/useToast";

interface MessageOptionMenuProps {
    message: ProjectChatTypes;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    isCurrentUser: boolean;
    className?: string;
    channel: ChannelType;
}

export default function ({
    message,
    open,
    setOpen,
    isCurrentUser,
    className,
    channel,
}: MessageOptionMenuProps) {
    const { toast } = useToast();
    if (message.is_deleted) return null;
    const ref = useRef<HTMLDivElement>(null);

    const { sendMessage } = useWebSocket();
    const setEditingState = useSetRecoilState(messageEditingState);


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    function deleteHandler() {
        if (isCurrentUser) {
            const newMessage = {
                messageId: message.id,
            };
            sendMessage(newMessage, channel.id, "project-chat-delete-message");
            toast({
                title: "Message deleted"
            })
        }
        setOpen(false);
    }

    function editHandler() {
        if (isCurrentUser) {
            setEditingState({
                messageId: message.id,
                originalMessage: message.message!
            });
        }
        setOpen(false);
    }

    function copyHandler() {
        navigator.clipboard.writeText(message.message!)
        setOpen(false);
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={ref}
                    className={`${className} relative z-[100]`}
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <div
                        className={`absolute z-[100] flex flex-col items-start w-20 ${isCurrentUser ? "right-0" : "left-0"
                            } rounded-[6px] text-[12px] overflow-hidden p-1 dark:bg-neutral-800 border-[0.5px] border-neutral-500`}
                    >
                        {
                            !message.is_deleted && (
                                <button onClick={copyHandler} type="button" className="px-3 py-1 w-full dark:hover:bg-[#2e2e2e] flex items-start rounded-[4px]" >
                                    Copy
                                </button>
                            )
                        }
                        {
                            !message.is_deleted && !message.is_edited && (
                                <button onClick={editHandler} type="button" className="px-3 py-1 w-full dark:hover:bg-[#2e2e2e] flex items-start rounded-[4px]">
                                    Edit
                                </button>
                            )
                        }
                        {
                            !message.is_deleted && (
                                <button onClick={deleteHandler} type="button" className="px-3 py-1 hover:bg-red-600 w-full flex items-start rounded-[4px]" >
                                    Delete
                                </button>
                            )
                        }
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
