import { organizationSettingsOptionAtom, OrganizationSettingsOptionEnum } from "@/recoil/atoms/organizationAtoms/organizationSettingsOptionAtom";
import { useRecoilState } from "recoil"
import { motion } from 'framer-motion'
import ToolTipComponent from "@/components/ui/ToolTipComponent";
import { IoIosInformationCircleOutline } from "react-icons/io";


function activeTooltip(option: OrganizationSettingsOptionEnum) {
    switch (option) {
        case OrganizationSettingsOptionEnum.TAGS:
            return "Tags help you categorize users and control content visibility within your organization. ";
        case OrganizationSettingsOptionEnum.USERS:
            return "user informaiom";
        case OrganizationSettingsOptionEnum.LOCATION:
            return "choose location of your organization to add events to that location";
        default:
            return "";
    }
}


export default function OrganizationSettingsOptions() {
    const [orgSettingsAtom, setOrgSettingsAtom] = useRecoilState(organizationSettingsOptionAtom);

    return (
        <div className="flex items-center justify-between mt-4 mx-1">

            <div className="flex items-center gap-x-12 select-none">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 * 0.01 }}
                    onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.USERS)}
                    className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.USERS && "underline decoration-[#ff4a4a] decoration-4 underline-offset-4 space-y-[4 underline-offset-4px]"}`}>
                    Users
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 * 0.01 }}
                    onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.TAGS)}
                    className={`cursor-pointer text-md font-light text-lightText dark:text-darkText 
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.TAGS && "underline decoration-[#ff4a4a] decoration-4 underline-offset-4 space-y-[20px]"}`}>
                    Tags
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 * 0.01 }}
                    onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.LOCATION)}
                    className={`cursor-pointer text-md font-light text-lightText dark:text-darkText 
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.LOCATION && "underline decoration-[#ff4a4a] decoration-4 underline-offset-4 space-y-[20px]"}`}>
                    Locations
                </motion.div>

            </div>
            <ToolTipComponent content={<span>{activeTooltip(orgSettingsAtom)}</span>}><IoIosInformationCircleOutline size={25} className="hover:text-primary/70 p-[3px] rounded-[4px] text-primary transition-colors ease-in" /></ToolTipComponent>
        </div>
    )
}
