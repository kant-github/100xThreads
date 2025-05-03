import { FaUserCheck } from "react-icons/fa6";

export default function () {
    return (
        <span className='px-2 py-1 flex items-center justify-center gap-x-1 border border-yellow-500 bg-yellow-600/60 rounded-[6px] text-[11px] mt-2'>
            <FaUserCheck />
            Friends
        </span>
    )
}