import CreateChatCard from "./CreateOrganizationCard";
import HomeCards from "./HomeCards";

export default function () {
    return (
        <div className="flex flex-col h-full">
            <CreateChatCard />
            <HomeCards />
        </div>
    )
}