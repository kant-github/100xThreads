import { useWebSocket } from "@/hooks/useWebsocket";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ChannelType, MessageType } from "types"

interface MessageOptionMenuProps {
  message: MessageType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isCurrentUser: boolean;
  className?: string
  channel: ChannelType;
}

export default function ({ message, open, setOpen, isCurrentUser, className, channel }: MessageOptionMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { sendMessage } = useWebSocket();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  function editHandler() {
    const newMessage = {
      messageId: message.id,
    }
    sendMessage(newMessage, channel.id, 'edit-message');
  }


  if (open) return (
    <div ref={ref} className={`${className} relative`}>
      <div className={`absolute flex flex-col items-start w-20 ${isCurrentUser ? "right-0" : "left-0"}  rounded-[4px] text-[12px] overflow-hidden`}>
        <button onClick={editHandler} type="button" className="px-3 py-1 w-full dark:bg-neutral-700 flex items-start">Edit</button>
        <button type="button" className="px-3 py-1 bg-red-700 w-full flex items-start">Delete</button>
      </div>
    </div>
  )
}