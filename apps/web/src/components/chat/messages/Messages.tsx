import { MessageType, UserType } from "types";
import FromUser from "./FromUser";
import ToUser from "./ToUser";


interface Props {
    message: any;
    chatUser?: UserType | null;
}

export default function ({ message, chatUser }: Props) {


    const isCurrentUser = message.user_id === 3;
    return (
        <div key={message.id} className={`flex gap-x-2`}>

            <div className="flex-shrink-0 gap-x-1">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {message.name[0]}
                </div>
            </div>

            <div className={`flex flex-col max-w-[70%]`}>
                <span className='text-sm font-semibold'>{message.name}</span>
                <div className={`text-[13px]`}>
                    {message.message}
                </div>
            </div>
        </div>
    )
}
