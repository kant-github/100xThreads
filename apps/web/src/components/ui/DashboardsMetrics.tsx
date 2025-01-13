import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import { useRecoilValue } from "recoil";
import { FcReadingEbook, FcSms, FcCalendar } from "react-icons/fc";

interface DashboardMetricsProps {
    className?: string;
}

export default function ({ className }: DashboardMetricsProps) {
    const organizationUsers = useRecoilValue(organizationUsersAtom);
    return (
        <div className={`${className} flex flex-row items-center justify-between`}>
            <div className="flex flex-col items-start gap-y-2 w-44 border-[0.5px] border-blue-600/40 p-3 rounded-[6px] relative bg-blue-500/10 hover:bg-blue-500/20">
                <FcReadingEbook size={20} className="absolute top-3 right-3" />
                <span className="text-xs font-light">Total Users</span>
                <span className="text-xl font-medium text-blue-500">{"1206"}</span>
            </div>
            <div className="flex flex-col items-start gap-y-2 w-44 border-[0.5px] border-green-600/40 p-3 rounded-[6px] relative bg-green-500/10 hover:bg-green-500/20">
                <FcSms size={20} className="absolute top-3 right-3" />
                <span className="text-xs font-light">Online Users</span>
                <span className="text-xl font-medium text-green-500">{"430"}</span>
            </div>
            <div className="flex flex-col items-start gap-y-2 w-44 border-[0.5px] border-red-600/40 p-3 rounded-[6px] relative bg-red-500/10 hover:bg-red-500/20">
                <FcCalendar size={20} className="absolute top-3 right-3" />
                <span className="text-xs font-light">Active Events</span>
                <span className="text-xl font-medium text-red-500">{"9"}</span>
            </div>
            <div className="flex flex-col items-start gap-y-2 w-44 border-[0.5px] border-yellow-600/40 p-3 rounded-[6px] relative bg-yellow-500/10 hover:bg-yellow-500/20">
                <FcReadingEbook size={20} className="absolute top-3 right-3" />
                <span className="text-xs font-light">Channel Count</span>
                <span className="text-xl font-medium text-yellow-500">{organizationUsers.length}</span>
            </div>
        </div>
    )
}