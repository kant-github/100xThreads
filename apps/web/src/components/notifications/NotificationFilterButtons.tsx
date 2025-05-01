import { Dispatch, SetStateAction } from "react"

interface NotificationFilterButtonsProps {
    activeFilter: "unread" | "all",
    setActiveFilter: Dispatch<SetStateAction<"unread" | "all">>;
}

export default function ({ activeFilter, setActiveFilter }: NotificationFilterButtonsProps) {
    return (
        <div className="w-full flex flex-row items-center justify-start gap-x-4">
            <button
                className={`text-md border-b-[4px] ${activeFilter === "all" ? "border-blue-600" : "border-transparent"
                    }`}
                type="button"
                onClick={() => setActiveFilter('all')}
            >
                All
            </button>

            <button
                className={`text-md border-b-[4px] ${activeFilter === "unread" ? "border-blue-600" : "border-transparent"
                    }`}
                type="button"
                onClick={() => setActiveFilter('unread')}
            >
                Unread
            </button>


        </div>
    )
}