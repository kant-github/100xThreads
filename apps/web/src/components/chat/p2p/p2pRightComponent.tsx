import { p2pChatAtom } from "@/recoil/atoms/p2p/p2pChatAtom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChatMessageOneToOneType } from "types/types";
import ChatMessageInput from "../ChatMessageInput";
import EmptyConversation from "../EmptyConversation";
import P2pGroupedByDateMessages from "./p2pGroupedByDateMessages";
import UserTyping from "@/components/utility/UserTyping";
import { p2pUser1Atom } from "@/recoil/atoms/p2p/p2pUser1Atom";
import { p2pUser2Atom } from "@/recoil/atoms/p2p/p2pUser2Atom";
import { messageEditingState } from "@/recoil/atoms/chats/messageEditingStateAtom";
import { v4 as uuidv4 } from 'uuid'

export default function () {
    const [p2pMessages, setP2pMessages] = useRecoilState(p2pChatAtom);
    const [message, setMessage] = useState<string>("");
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const [editingState, setEditingState] = useRecoilState(messageEditingState);
    const user1 = useRecoilValue(p2pUser1Atom);
    const user2 = useRecoilValue(p2pUser2Atom);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        console.log("chat messages are : ", p2pMessages);
    }, [])

    const groupedMessages = useMemo(() => {
        const grouped: { [key: string]: ChatMessageOneToOneType[] } = {};

        p2pMessages.forEach(message => {
            const date = new Date(message.created_at).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });

        return Object.entries(grouped).sort((a, b) =>
            new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );
    }, [p2pMessages]);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function handleSendMessage(e?: React.FormEvent) {
        if (e) {
            e.preventDefault();
        }

        if (!message.trim()) return;

        if (editingState) {
            const editedMessage = {
                messageId: editingState.messageId,
                message: message.trim()
            };
            // sendMessage(editedMessage, channel.id, 'edit-message');
            setEditingState(null);
        } else {
            const newMessage: any = {
                id: uuidv4(),
                message: message,
                name: user1.name,
                is_deleted: false,
                is_edited: false,
                created_at: new Date(Date.now()),
                LikedUsers: []
            };

            // sendMessage(newMessage, channel.id, 'insert-general-channel-message');
            // setMessages(prevChats => [...prevChats, newMessage]);
        }
        setMessage("");
    }

    function sendTypingEvent(type: boolean) {
        const newTypingdata = {
            user_id: user1.id,
            userName: user1.name,
            typingEventType: type,
        }
        // sendMessage(newTypingdata, channel.id, 'typing-event');
    }

    function handleTyping() {
        if (!typingTimeout) {
            sendTypingEvent(true);
        }

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeOut = setTimeout(() => {
            sendTypingEvent(false);
            setTypingTimeout(null);
        }, 1500);

        setTypingTimeout(timeOut);
    }

    useEffect(() => {
        scrollToBottom();
    }, [p2pMessages]);

    return (
        <div className="h-full flex flex-col relative px-4 py-2 flex-1 bg-neutral-800">
            <div className='flex-1 w-full overflow-y-auto scrollbar-hide'>
                <div className='flex flex-col space-y-5 w-full'>
                    <P2pGroupedByDateMessages groupedMessages={groupedMessages} />
                    <div ref={messagesEndRef} />
                </div>
                {!p2pMessages.length && <EmptyConversation className="h-full" />}
            </div>
            <form className='w-full pb-1' >
                <UserTyping usersTyping={usersTyping} />
                <div className='flex items-center gap-x-2'>

                    <ChatMessageInput
                        className="w-full mx-auto"
                        message={message}
                        setMessage={setMessage}
                        handleTyping={handleTyping}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </form>
        </div>
    )
}