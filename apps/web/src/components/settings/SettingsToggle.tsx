import { settingsOptionAtom, settingsOptionEnum } from "@/recoil/atoms/SettingsOptionAtom"
import { useRecoilState } from "recoil"

export default function SettingsOptions() {
    const [settingsAtom, setSettingsAtom] = useRecoilState(settingsOptionAtom);

    return (
        <div className="flex items-center gap-x-12"> {/* Adjusted the gap between items */}
            <div
                onClick={() => {
                    // console.log(settingsAtom);
                    setSettingsAtom(settingsOptionEnum.Appearance)
                }}
                className={`cursor-pointer text-md font-light text-zinc-100 
                ${settingsAtom === settingsOptionEnum.Appearance && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[4 underline-offset-4px]"}`}>
                Appearance
            </div>
            <div
                onClick={() => setSettingsAtom(settingsOptionEnum.Visibility)}
                className={`cursor-pointer text-md font-light text-zinc-100 
                ${settingsAtom === settingsOptionEnum.Visibility && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-2"}`}>
                Visibility
            </div>
            <div
                onClick={() => setSettingsAtom(settingsOptionEnum.Profile)}
                className={`cursor-pointer text-md font-light text-zinc-100 
                ${settingsAtom === settingsOptionEnum.Profile && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[20px]"}`}>
                Profile
            </div>
        </div>
    )
}
