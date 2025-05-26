import { settingsOptionAtom, settingsOptionEnum } from "@/recoil/atoms/SettingsOptionAtom"
import { useRecoilState } from "recoil"
import { motion } from 'framer-motion'

export default function SettingsOptions() {
    const [settingsAtom, setSettingsAtom] = useRecoilState(settingsOptionAtom);

    return (
        <div className="flex items-center gap-x-12 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 * 0.01 }}
                onClick={() => setSettingsAtom(settingsOptionEnum.Profile)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText 
                ${settingsAtom === settingsOptionEnum.Profile && "underline decoration-[#ff4a4a] decoration-4 underline-offset-4 space-y-[20px]"}`}>
                Profile
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 * 0.01 }}
                onClick={() => setSettingsAtom(settingsOptionEnum.Appearance)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${settingsAtom === settingsOptionEnum.Appearance && "underline decoration-[#ff4a4a] decoration-4 underline-offset-4 space-y-[4 underline-offset-4px]"}`}>
                Appearance
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 * 0.01 }}
                onClick={() => setSettingsAtom(settingsOptionEnum.Visibility)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${settingsAtom === settingsOptionEnum.Visibility && "underline decoration-[#ff4a4a] decoration-4 underline-offset-4 space-y-2"}`}>
                Visibility
            </motion.div>
        </div>
    )
}
