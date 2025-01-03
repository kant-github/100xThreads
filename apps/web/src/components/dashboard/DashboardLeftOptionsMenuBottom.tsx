import { IoMdSettings } from "react-icons/io";
import { MdRateReview } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

export default function () {
    return (
        <div className="py-1 sm:py-2 rounded-[8px] flex flex-col gap-y-0.5">
            <div className="flex items-center justify-between gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 hover:bg-zinc-800 px-2 sm:px-3 rounded-[8px] transition-colors">
                <span className="text-[12px] sm:text-[13px] text-gray-100 font-normal tracking-wide">Write a review</span>
                <MdRateReview size={16} className="sm:size-[18px] mr-0.5 sm:mr-1" />
            </div>
            <div 
                onClick={() => window.open("https://github.com/kant-github/100xthreads")} 
                className="flex items-center justify-between gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 hover:bg-blue-600 px-2 sm:px-3 rounded-[8px] transition-colors"
            >
                <span className="text-[12px] sm:text-[13px] text-gray-100 font-normal tracking-wide">Github</span>
                <FaGithub size={16} className="sm:size-[18px] mr-0.5 sm:mr-1" />
            </div>
        </div>
    );
}