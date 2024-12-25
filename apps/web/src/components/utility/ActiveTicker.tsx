import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function () {
    return (
        <div>
            <div className="flex items-center gap-x-1 text-green-500 text-[10px] rounded-[4px] bg-green-500/20 px-1 py-0.5">Active{" "}<IoIosCheckmarkCircleOutline size={14} /></div>
        </div>
    )
}