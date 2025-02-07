import { useWebSocket } from "@/hooks/useWebsocket";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ChannelType, MessageType } from "types";
import { motion, AnimatePresence } from "framer-motion";

interface MessageOptionMenuProps {
  message: MessageType;
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
  const ref = useRef<HTMLDivElement>(null);

  const { sendMessage } = useWebSocket();

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
      sendMessage(newMessage, channel.id, "delete-message");
    }
    setOpen(false);
  }

  function editHandler() {
    console.log("sending edit message request");
    if (isCurrentUser) {
      const newMessage = {
        messageId: message.id,
        message: "I have edited this message"
      };
      sendMessage(newMessage, channel.id, "edit-message");
    }
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
              } rounded-[4px] text-[12px] overflow-hidden`}
          >
            <button
              onClick={() => navigator.clipboard.writeText(message.message!)}
              type="button"
              className="px-3 py-1 w-full dark:bg-neutral-700 dark:hover:bg-[#2e2e2e] flex items-start"
            >
              Copy
            </button>
            <button
              onClick={editHandler}
              type="button"
              className="px-3 py-1 w-full dark:bg-neutral-700 dark:hover:bg-[#2e2e2e] flex items-start"
            >
              Edit
            </button>
            <button
              onClick={deleteHandler}
              type="button"
              className="px-3 py-1 bg-red-700 hover:bg-red-600 w-full flex items-start"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
