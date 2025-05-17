import { organizationSettingsOptionAtom, OrganizationSettingsOptionEnum } from "@/recoil/atoms/organizationAtoms/organizationSettingsOptionAtom";
import { useRecoilState } from "recoil"
import { motion } from 'framer-motion'

export default function OrganizationSettingsOptions() {
    const [orgSettingsAtom, setOrgSettingsAtom] = useRecoilState(organizationSettingsOptionAtom);

    return (
        <div className="flex items-center gap-x-12 select-none mt-4">

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 * 0.01 }}
                onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.TAGS)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText 
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.TAGS && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[20px]"}`}>
                Tags
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 * 0.01 }}
                onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.USERS)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.USERS && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[4 underline-offset-4px]"}`}>
                Users
            </motion.div>

        </div>
    )
}
