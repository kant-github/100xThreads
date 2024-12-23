import { userSessionAtom } from "@/recoil/atoms/atom";
import ChatCards from "../base/ChatCards";
import CreateChatCard from "./CreateChatCard";
import { useRecoilValue } from "recoil";

export default function () {
    const session = useRecoilValue(userSessionAtom);
    return (
        <>
            <CreateChatCard session={session} />
            <ChatCards />
        </>
    )
}