import DashboardLeftOptionsMenuTop from "../dashboard/DashboardLeftOptionsMenuTop";
import DashboardLeftOptionsMenuBottom from "./DashboardLeftOptionsMenuBottom";

export default function () {
    return (
        <div className="w-1/4 bg-[#37474f] dark:bg-[#141313] border-r-[1px] dark:border-zinc-800 dark:text-gray-200 shadow-xl z-50 px-3 py-2 flex flex-col justify-between h-full">            
            <DashboardLeftOptionsMenuTop/>
            <DashboardLeftOptionsMenuBottom/>
        </div>
    )
}