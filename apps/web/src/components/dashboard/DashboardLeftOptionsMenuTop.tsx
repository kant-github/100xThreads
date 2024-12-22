import { GoHomeFill } from "react-icons/go";
import { FaIndustry } from "react-icons/fa6";
import { IoMdBody } from "react-icons/io";
import ProfileOption from "../ui/ProfileOption";



export default function () {

    return (
        <div className="h-24 py-2 rounded-[8px]">
            <ProfileOption/>
            <div className="flex flex-col gap-y-0.5">
                <div className="flex items-center justify-start gap-x-3 py-1.5 hover:bg-zinc-800 px-3 rounded-[8px]">
                    <GoHomeFill size={20} />
                    <span className="text-[13px] text-zinc-100 font-normal mt-0.5 tracking-wide">Home</span>
                </div>
                <div className="flex items-center justify-start gap-x-3 py-1.5 hover:bg-zinc-800 px-3 rounded-[8px]">
                    <IoMdBody size={20} />
                    <span className="text-[13px] text-zinc-100 font-normal mt-0.5 tracking-wide">Owned by you</span>
                </div>
                <div className="flex items-center justify-start gap-x-3 py-1.5 hover:bg-zinc-800 px-3 rounded-[8px]">
                    <FaIndustry size={20} />
                    <span className="text-[13px] text-zinc-100 font-normal mt-0.5 tracking-wide">All Organizations</span>
                </div>
            </div>

        </div>
    )
}