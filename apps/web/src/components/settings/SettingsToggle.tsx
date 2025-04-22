import { settingsOptionAtom, settingsOptionEnum } from "@/recoil/atoms/SettingsOptionAtom"
import { useRecoilState } from "recoil"

export default function SettingsOptions() {
    const [settingsAtom, setSettingsAtom] = useRecoilState(settingsOptionAtom);

    return (
        <div className="flex items-center gap-x-12 select-none">
            <div
                onClick={() => setSettingsAtom(settingsOptionEnum.Profile)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText 
                ${settingsAtom === settingsOptionEnum.Profile && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[20px]"}`}>
                Profile
            </div>
            <div
                onClick={() => setSettingsAtom(settingsOptionEnum.Appearance)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${settingsAtom === settingsOptionEnum.Appearance && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[4 underline-offset-4px]"}`}>
                Appearance
            </div>
            <div
                onClick={() => setSettingsAtom(settingsOptionEnum.Visibility)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${settingsAtom === settingsOptionEnum.Visibility && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-2"}`}>
                Visibility
            </div>
        </div>
    )
}
