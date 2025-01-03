import DashboardLeftOptionsMenuTop from "../dashboard/DashboardLeftOptionsMenuTop";
import DashboardLeftOptionsMenuBottom from "./DashboardLeftOptionsMenuBottom";

export default function () {
    return (
        <div className="w-full md:w-72 lg:w-3.5/12 bg-white dark:bg-[#171717] border-b-[1px] md:border-b-0 md:border-r-[1px] dark:border-zinc-800 dark:text-gray-200 shadow-xl px-2 sm:px-3 py-2 flex flex-col justify-between min-h-[80px] transition-all">            
            <DashboardLeftOptionsMenuTop/>
            {/* <div className="hidden md:block"> */}
                <DashboardLeftOptionsMenuBottom/>
            {/* </div> */}
        </div>
    );
}