import { IoMdSettings } from "react-icons/io";
import { MdRateReview } from "react-icons/md";
import { FaGithub } from "react-icons/fa";


export default function () {
    return (
        <div className="py-2 rounded-[8px] flex flex-col gap-y-0.5">
            <div className="flex items-center justify-between gap-x-3 py-2 hover:bg-zinc-800 px-3 rounded-[8px]">
                <span className="text-[13px] text-gray-100 font-normal tracking-wide">Write a review</span>
                <MdRateReview size={18} className="mr-1" />
            </div>
            <div className="flex items-center  justify-between bg- gap-x-3 py-2 hover:bg-blue-600 px-3 rounded-[8px]">
                <span className="text-[13px] text-gray-100 font-normal tracking-wide">Github</span>
                <FaGithub size={18} className="mr-1" />
            </div>
        </div>
    )
}