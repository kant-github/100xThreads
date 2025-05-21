import { settingsOptionAtom, settingsOptionEnum } from "@/recoil/atoms/SettingsOptionAtom"
import { useRecoilValue } from "recoil"
import SettingsAppearanceComponent from "./SettingsAppearanceComponent";
import SettingsVisibilityComponent from "./SettingsVisibilityComponent";
import SettingsProfileComponent from "./SettingsProfileComponent";

export default function () {
    const settingsOption = useRecoilValue(settingsOptionAtom);
    console.log(settingsOption);
    const renderComponent = () => {
        switch (settingsOption) {
            case settingsOptionEnum.Appearance:
                return <SettingsAppearanceComponent />;
            case settingsOptionEnum.Visibility:
                return <SettingsVisibilityComponent />;
            case settingsOptionEnum.Profile:
                return <SettingsProfileComponent />;
            default:
                console.warn(`No matching component for: ${settingsOption}`);
                return <div>No matching component found!</div>;
        }
    };

    return (
        <div className="flex items-center gap-x-24 dark:bg-secDark bg-secondLight w-full mt-6 rounded-[8px] shadow-lg shadow-black/40 ">
            {renderComponent()}
        </div>
    );
}
