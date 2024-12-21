import React, { useRef, useState, useEffect, useMemo } from "react";
import { ChatGroupType, GroupChatUserType, LikedUser, MessageType, UserType } from "types";
import { getSocket, sendMessage, sendTypingEvent } from "@/lib/socket.config";
import { v4 as uuidv4 } from "uuid";
import Messages from "./messages/Messages";
import ChatMessageInput from "./ChatMessageInput";
import { EmptyConversation } from "./EmptyConversation";
import BlackBtn from "../buttons/BlackBtn";
import TypingDots from "../loaders/TypingDots";
import { IoSendSharp } from "react-icons/io5";

interface Props {
  olderChats: MessageType[];
  chatUser?: UserType | null;
  group: ChatGroupType;
  users: GroupChatUserType[];
  socket: WebSocket | null
}

export default function ChatComponent({
  chatUser,
  olderChats,
  group,
  users,
  socket
}: Props) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>(olderChats);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Typed properly for scroll
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingStartSentRef = useRef(false);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (!socket) return;



    const handleMessage = (event: MessageEvent) => {
      const parsedEvent = JSON.parse(event.data);
      const data = parsedEvent.message;


      if (!data?.message?.trim()) {
        // console.warn("Received an empty message:", data);
        return;
      }

      const messageExists = messages.some((msg) => msg.id === data.id);
      if (!messageExists) {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
      } else {
        console.warn("Duplicate message received:", data);
      }
    };

    const handleTypingEvent = (event: MessageEvent) => {
      const typingData = JSON.parse(event.data);
      const { type, userId } = typingData;

      if (Number(userId) === chatUser?.id) return;

      let checkUsers = users.find((u) => u.user.id === Number(userId));
      if (!checkUsers) return;

      if (type === "typing-start") {
        setTypingUsers((prev) => {
          if (!prev.includes(checkUsers.user.name)) {
            return [...prev, checkUsers.user.name];
          }
          return prev;
        });
      } else if (type === "typing-stop") {
        setTypingUsers((prev) =>
          prev.filter((name) => name !== checkUsers.user.name)
        );
      }
    };


    const handleSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "like-event" || data.type === "unlike-event") {
        const { messageId, userId, name } = data;
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.id === messageId) {
              if (data.type === "like-event") {
                return {
                  ...msg,
                  LikedUsers: [
                    ...msg.LikedUsers,
                    { user_id: userId, message_id: msg.id, username: name, created_at: new Date().toISOString() } as LikedUser,
                  ],
                };
              } else if (data.type === "unlike-event") {
                return {
                  ...msg,
                  LikedUsers: msg.LikedUsers.filter((x) => x.user_id !== userId),
                };
              }
            }
            return msg;
          }))

      }
    };

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat-message") {
        handleMessage(event);
      } else if (data.type === "typing-start" || data.type === "typing-stop") {
        handleTypingEvent(event);
      } else if (data.type === "like-event" || data.type === "unlike-event") {
        handleSocketMessage(event)
      }
    };

    socket.removeEventListener("message", handleWebSocketMessage);
    socket.addEventListener("message", handleWebSocketMessage);


    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket, messages, chatUser?.id]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !chatUser) return;

    const newMessage: MessageType = {
      id: uuidv4(),
      message,
      name: chatUser?.name ?? "Unknown",
      group_id: group.id,
      user_id: chatUser?.id ?? 0,
      created_at: new Date().toISOString(),
      user: chatUser,
      LikedUsers: []
    };

    sendMessage(newMessage, "chat-message");
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    scrollToBottom();
    sendTypingEvent(chatUser?.id.toString(), "typing-stop");
  };


  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!typingStartSentRef.current) {
      sendTypingEvent(chatUser?.id.toString()!, "typing-start");
      typingStartSentRef.current = true;
    }

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingEvent(chatUser?.id.toString()!, "typing-stop");
      typingStartSentRef.current = false;
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[82vh] p-4 bg-white dark:bg-[#262629] rounded-[6px]">
      <div className="mt-4">{messages.length < 1 && <EmptyConversation />}</div>
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div className="flex flex-col gap-2 px-2 mb-4">
          {messages.map((msg) => (
            <Messages key={msg.id} msg={msg} chatUser={chatUser!} />
          ))}
        </div>
      </div>
      <div>
        {typingUsers.length > 0 && (
          <div
            className={`text-xs text-yellow-500 flex flex-row items-center gap-x-2 font-light ml-4 transition-opacity duration-300 ease-in-out ${typingUsers.length > 0 ? "opacity-100" : "opacity-0"
              }`}
          >
            <TypingDots />
            {typingUsers.length > 3 ? (
              <>
                {typingUsers.slice(0, 3).join(", ")} and{" "}
                {typingUsers.length - 3} others are typing...
              </>
            ) : (
              <>
                {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}{" "}
                typing...
              </>
            )}
          </div>
        )}
      </div>

      <form
        className="mt-2 flex justify-between items-center gap-x-4 w-full"
        onSubmit={handleSendMessage}
      >
        <div className="ml-2 gap-x-6 flex items-center w-full mb-2">
          <ChatMessageInput
            message={message}
            setMessage={setMessage}
            onChange={handleTyping}
          />
          <BlackBtn className={"flex items-center justify-center gap-x-2"}>
            <IoSendSharp className="text-yellow-500" />
          </BlackBtn>
        </div>
      </form>
    </div>
  );
}
