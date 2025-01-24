import { userSessionAtom } from "@/recoil/atoms/atom";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { MessageType } from "types";

interface MessagesProps {
    message: MessageType;
}

interface MessageContentProps {
    message: MessageType;
}

function MessageContent({ message }: MessageContentProps) {
    const messageText = message.message;

    return (
        <div className="flex-shrink-0 space-y-2 mt-[2px]">
            <p className="text-[13px] font-light tracking-wider whitespace-pre-wrap break-words">
                {messageText}
            </p>
        </div>
    );
};

export default function ({ message }: MessagesProps) {
    const session = useRecoilValue(userSessionAtom);
    let currentUser = false;

    if (Number(message.org_user_id) === Number(session.user?.id)) {
        currentUser = true;
    }

    return (
        <div key={message.id} className="flex gap-x-2">
            <div className="flex-shrink-0 gap-x-1">
                {
                    currentUser ? (
                        <Image src={session.user?.image!} width={36} height={36} className="rounded-full" alt="user-image" />
                    ) : (
                        <Image src={message.organization_user?.user.image!} width={36} height={36} className="rounded-full" alt="user-image" />
                    )
                }
            </div>
            <div className="flex flex-col max-w-[70%]">
                <span className="text-[13px] font-semibold">{message.name}</span>
                <MessageContent message={message} />
            </div>
        </div>
    );
};
