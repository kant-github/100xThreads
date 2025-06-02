import { useWebSocket } from "@/hooks/useWebsocket";
import { Dispatch, SetStateAction, useRef } from "react";
import { ChannelType, MessageType } from "types/types";
import { useSetRecoilState } from "recoil";
import { messageEditingState } from "@/recoil/atoms/chats/messageEditingStateAtom";
import { toast } from "sonner";
import UtilityOptionMenuCard from "../utility/UtilityOptionMenuCard";
import { useToast } from "@/hooks/useToast";

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

  if (message.is_deleted) return null;
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { sendMessage } = useWebSocket();
  const setEditingState = useSetRecoilState(messageEditingState);




  function deleteHandler() {
    if (isCurrentUser) {
      const newMessage = {
        messageId: message.id,
      };
      sendMessage(newMessage, channel.id, "delete-message");
      toast({
        title: "Message deleted",
      });
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
    <UtilityOptionMenuCard open={open} setOpen={setOpen}>
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
    </UtilityOptionMenuCard>
  );
}
