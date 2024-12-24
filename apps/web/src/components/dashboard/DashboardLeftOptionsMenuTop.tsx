import { GoHomeFill } from "react-icons/go";
import { FaIndustry } from "react-icons/fa6";
import { IoMdBody, IoMdSettings } from "react-icons/io";
import ProfileOption from "../ui/ProfileOption";
import { useRecoilState } from "recoil";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";


export const baseDivStyles = "flex items-center justify-start gap-x-3 py-2 px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide";

function Option({ isSelected, onClick, Icon, label, }: {
    isSelected: boolean;
    onClick: () => void;
    Icon: React.ComponentType<{ size: number }>;
    label: string;
}) {
    return (
        <div onClick={onClick} className={`${baseDivStyles} ${isSelected ? "bg-zinc-700 text-white" : "hover:bg-zinc-800"}`}>
            <Icon size={18} />
            <span className={`${textStyles}`}>{label}</span>
        </div>
    );
}

export default function () {
    const [renderOption, setRenderOption] = useRecoilState(dashboardOptionsAtom);

    return (
        <div className="h-24 py-2 rounded-[8px]">
            <ProfileOption />
            <div className="flex flex-col mt-3">
                <Option
                    isSelected={renderOption === RendererOption.Home}
                    onClick={() => setRenderOption(RendererOption.Home)}
                    Icon={GoHomeFill}
                    label="Home"
                />
                <Option
                    isSelected={renderOption === RendererOption.OwnedByYou}
                    onClick={() => setRenderOption(RendererOption.OwnedByYou)}
                    Icon={IoMdBody}
                    label="Owned by you"
                />
                <Option
                    isSelected={renderOption === RendererOption.AllOrganization}
                    onClick={() => setRenderOption(RendererOption.AllOrganization)}
                    Icon={FaIndustry}
                    label="All Organizations"
                />
                <Option
                    isSelected={renderOption === RendererOption.Settings}
                    onClick={() => setRenderOption(RendererOption.Settings)}
                    Icon={IoMdSettings}
                    label="Settings"
                />
            </div>
        </div>
    );
}
