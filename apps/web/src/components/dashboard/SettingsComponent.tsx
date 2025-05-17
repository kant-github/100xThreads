import { useState } from "react";
import DashboardComponentHeading from "./DashboardComponentHeading";
import SettingsToggle from "../settings/SettingsToggle";
import SettingsRenderer from "../settings/SettingsRenderer";



export default function () {
    const [isToggled, setIsToggled] = useState(false);
    const toggle = () => setIsToggled(!isToggled);

    return (
        <div className="bg-light dark:bg-dark h-full ">
            <DashboardComponentHeading className="pt-4 pl-12" description="Manage your preferences and account settings">Settings</DashboardComponentHeading>
            <div className="pt-8 mx-12">
                <SettingsToggle />
                <SettingsRenderer />
            </div>
        </div>
    )
}