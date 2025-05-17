import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";

export default function OrganizationSettingsUsersUI() {
    return (
        <div className="w-full flex flex-col h-full py-4 px-8">
            <DashboardComponentHeading description="Invite, remove, or update access for users in your organization.">
                Users
            </DashboardComponentHeading>
        </div>
    );
}
