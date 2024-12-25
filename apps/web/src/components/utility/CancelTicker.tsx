import { MdOutlineCancel } from "react-icons/md";

export default function () {
    return (
        <div>
            <div className="flex items-center gap-x-1 text-red-500 text-[10px] rounded-[4px] bg-red-500/20 px-1 py-0.5">Cancelled{" "}<MdOutlineCancel size={14} /></div>
        </div>
    )
}