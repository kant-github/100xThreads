import DashboardLeftOptions from "./DashboardLeftOptions";
import DashboardRightOptions from "./DashboardRightOptions";

export default function Dashboard() {
    return (
        <div className="flex flex-col md:flex-row h-full">
            <DashboardLeftOptions />
            <div className="flex-1 overflow-hidden">
                <DashboardRightOptions />
            </div>
        </div>
    );
}