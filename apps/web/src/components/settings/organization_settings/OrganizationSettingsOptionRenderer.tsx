import { organizationSettingsOptionAtom, OrganizationSettingsOptionEnum } from "@/recoil/atoms/organizationAtoms/organizationSettingsOptionAtom";
import { useRecoilValue } from "recoil";
import TagSettingsUI from "./TagSettingsUI";

export default function OrganizationSettingsOptionRenderer() {
    const organizationSettingsOption = useRecoilValue(organizationSettingsOptionAtom);
    
    function renderComponent() {
        switch (organizationSettingsOption) {
            case OrganizationSettingsOptionEnum.TAGS:
                return <TagSettingsUI />;
            default:
                return null;
        }
    }
    
    return (
        <div className="dark:bg-neutral-800 bg-secondLight w-full mt-6 rounded-[8px] shadow-lg shadow-black/40 flex-grow overflow-hidden">
            {renderComponent()}
        </div>
    );
}