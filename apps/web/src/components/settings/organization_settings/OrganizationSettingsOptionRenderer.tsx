import { organizationSettingsOptionAtom, OrganizationSettingsOptionEnum } from "@/recoil/atoms/organizationAtoms/organizationSettingsOptionAtom";
import { useRecoilValue } from "recoil";
import TagSettingsUI from "./TagSettingsUI";
import OrganizationSettingsUsersUI from "./OrganizationSettingsUsersUI";
import OrganizationSettingsLocationUI from "./OrganizationSettingsLocationUI";

export default function OrganizationSettingsOptionRenderer() {
    const organizationSettingsOption = useRecoilValue(organizationSettingsOptionAtom);

    function renderComponent() {
        switch (organizationSettingsOption) {
            case OrganizationSettingsOptionEnum.TAGS:
                return <TagSettingsUI />;
            case OrganizationSettingsOptionEnum.USERS:
                return <OrganizationSettingsUsersUI />;
            case OrganizationSettingsOptionEnum.LOCATION:
                return <OrganizationSettingsLocationUI />
            default:
                return null;
        }
    }

    return (
        <div className="dark:bg-neutral-900 bg-secondLight w-full mt-6 rounded-[8px] shadow-lg shadow-black/40 flex-grow overflow-hidden">
            {renderComponent()}
        </div>
    );
}