import Image from "next/image";
import { MessageType, UserType } from "types";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";
import MessageOptionsMenu from "@/components/ui/MessageOptionsMenu";
import { sendLikeEvent, sendUnlikeEvent } from "@/lib/socket.front";
import LikedUsersDropdown from "../LikedUsersDropdown";
import { AiFillLike } from "react-icons/ai";

interface Props {
  msg: MessageType;
  chatUser: UserType | null;
}

export default function Message({ msg, chatUser }: Props) {
  const [messageOptionDialogbox, setMessageOptionDialogbox] = useState(false);
  const [likeCount, setLikeCount] = useState(msg.LikedUsers.length);
  const [likedUsersDropDown, setLikedUsersDropdown] = useState<boolean>(false);
  const [like, setLike] = useState<boolean>(msg.LikedUsers.some((user) => user.user_id === chatUser?.id));
  const formattedDate = formatDistanceToNowStrict(new Date(msg.created_at), {
    addSuffix: true,
  });

  useEffect(() => {
    setLikeCount(msg.LikedUsers.length);
  }, [msg.LikedUsers.length])

  const likeHandler = () => {
    if (!chatUser) return;

    const currentUserLiked = msg.LikedUsers.some((user) => user.user_id === chatUser.id);

    if (currentUserLiked) {
      sendUnlikeEvent(msg.id, chatUser.id, chatUser.name);
      msg.LikedUsers = msg.LikedUsers.filter((user) => user.user_id !== chatUser.id);
      setLikeCount((prev) => Math.max(0, prev - 1));
      setLike(false);
    } else {
      sendLikeEvent(msg.id, chatUser.id, chatUser.name);
      msg.LikedUsers.push({ user_id: chatUser.id, username: chatUser.name, message_id: msg.id });
      setLikeCount((prev) => prev + 1);
      setLike(true);
    }
  };

  return (
    <div className="flex items-start gap-2 max-w-sm self-end mb-4">
      <div className="flex items-end gap-x-2">
        <div
          onDoubleClick={likeHandler}
          className="relative text-sm font-light bg-gradient-to-r from-zinc-900 to-black text-white rounded-bl-[9px] rounded-tl-[9px] rounded-tr-[9px] py-1.5 px-4 select-none cursor-pointer"
        >
          {likeCount > 0 &&
            <div className="bg-zinc-700 flex items-center justify-center gap-x-2 rounded-[12px] px-2 absolute -top-3 left-3" onClick={() => setLikedUsersDropdown(true)}>
              <AiFillLike onClick={() => setLikedUsersDropdown(true)} className="text-yellow-500" />
              {<span className="text-red-500 text-[10px]">{likeCount}</span>}
            </div>
          }
          <div className="absolute bottom-1 left-1">
            <MessageOptionsMenu like={like} setLike={setLike} likeHandler={likeHandler} msg={msg} isOpen={messageOptionDialogbox} setIsOpen={setMessageOptionDialogbox}
            />
          </div>
          <div className="ml-2">
            <span className="text-green-600 flex justify-end text-xs font-medium">
              You
            </span>
            <span className="block">{msg.message}</span>
            <span className="text-[8px] flex justify-end text-gray-400 ">
              {formattedDate}
            </span>
          </div>
        </div>
        <Image alt="User Image" src={msg.user?.image!} width={36} height={36} className="rounded-full"
        />
      </div>


      <LikedUsersDropdown likedUsers={msg.LikedUsers} open={likedUsersDropDown} setOpen={setLikedUsersDropdown} />

    </div>
  );
}
