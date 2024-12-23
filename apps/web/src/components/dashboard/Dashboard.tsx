import DashboardLeftOptions from "./DashboardLeftOptions";
import DashboardRightOptions from "./DashboardRightOptions";


export default function Dashboard() {
    return (
        <div className="flex h-full">
            <DashboardLeftOptions />
            <DashboardRightOptions />
        </div>
    );
}