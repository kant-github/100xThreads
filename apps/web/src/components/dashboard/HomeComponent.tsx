import { userSessionAtom } from "@/recoil/atoms/atom";
import CreateChatCard from "./CreateChatCard";
import { useRecoilValue } from "recoil";
import HomeCards from "./HomeCards";

export default function () {
    const session = useRecoilValue(userSessionAtom);
    return (
        <div className="flex flex-col h-full">
            <CreateChatCard session={session} />
            <HomeCards/>
        </div>
    )
}