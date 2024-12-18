import Image from "next/image";
import ChatCards from "../base/ChatCards";
import CreateChatCard from "./CreateChatCard";
import { GroupChatType } from "types";
import { CustomSession } from "app/api/auth/[...nextauth]/options";
interface props {
    groups: GroupChatType[];
    session: CustomSession | null;
    recentGroups?: any
}

export default async function ({ groups, session, recentGroups }: props) {
    return (
        <div className="w-full bg-[#f2f2f2] dark:bg-[#1c1c1c]">
            <div className="md:pl-12 w-full flex flex-row justify-center gap-x-40 items-center">
                <CreateChatCard session={session} />
                <div className="mr-36 md:block hidden">
                    <Image src="/images/dashImage.jpeg" width={400} height={400} className="rounded-[8px]" alt="dashboard-conversation" />
                </div>
            </div>
            <div>
                <ChatCards token={session?.user?.token!} recentGroups={recentGroups} groups={groups} />
            </div>
        </div>
    );
}