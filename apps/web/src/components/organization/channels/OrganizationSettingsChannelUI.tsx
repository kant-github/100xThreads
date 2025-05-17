import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import OrganizationSettingsOptionRenderer from "@/components/settings/organization_settings/OrganizationSettingsOptionRenderer";
import OrganizationSettingsToggle from "@/components/settings/organization_settings/OrganizationSettingsToggle";

export default function OrganizationSettingsChannelUI() {
    return (
        <div className="dark:bg-neutral-900 h-full flex flex-col items-start w-full p-6 relative overflow-hidden">
            <DashboardComponentHeading description="Manage your organization settings">Settings</DashboardComponentHeading>
            <div className="w-full flex flex-col flex-grow overflow-hidden">
                <OrganizationSettingsToggle />
                <OrganizationSettingsOptionRenderer />
            </div>
        </div>
    );
}