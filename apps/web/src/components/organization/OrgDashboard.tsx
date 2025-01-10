import OrganizationLeftDashboard from "./OrganizationLeftDashboard";
import OrganizationMiddleDashboard from "./OrganizationMiddleDashboard";
import OrganizationRightDashboard from "./OrganizationRightDashboard";

export default function () {
    return (
        <div className="flex flex-col md:flex-row h-full">
            <OrganizationLeftDashboard />
            <OrganizationMiddleDashboard />
            <OrganizationRightDashboard />
        </div>
    )
}