import { organizationSettingsOptionAtom, OrganizationSettingsOptionEnum } from "@/recoil/atoms/organizationAtoms/organizationSettingsOptionAtom";
import { useRecoilState } from "recoil"

export default function OrganizationSettingsOptions() {
    const [orgSettingsAtom, setOrgSettingsAtom] = useRecoilState(organizationSettingsOptionAtom);

    return (
        <div className="flex items-center gap-x-12 select-none mt-4">
            <div
                onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.TAGS)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText 
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.TAGS && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[20px]"}`}>
                Tags
            </div>
            <div
                onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.TAGS)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.TAGS && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-[4 underline-offset-4px]"}`}>
                Others
            </div>
            <div
                onClick={() => setOrgSettingsAtom(OrganizationSettingsOptionEnum.TAGS)}
                className={`cursor-pointer text-md font-light text-lightText dark:text-darkText
                ${orgSettingsAtom === OrganizationSettingsOptionEnum.TAGS && "underline decoration-blue-500 decoration-4 underline-offset-4 space-y-2"}`}>
                Channels
            </div>
        </div>
    )
}
