import CreateChatCard from "./CreateChatCard";
import HomeCards from "./HomeCards";

export default function () {
    return (
        <div className="flex flex-col h-full">
            <CreateChatCard />
            <HomeCards />
        </div>
    )
}