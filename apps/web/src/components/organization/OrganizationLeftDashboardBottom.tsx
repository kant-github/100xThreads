import { IoMdAdd } from "react-icons/io";

export default function () {
    return (
        <div className="group flex items-center justify-center gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 h-10 bg-yellow-600 hover:bg-yellow-600/90 px-2 sm:px-3 rounded-[8px] transition-colors cursor-pointer">
            <IoMdAdd
                size={16}
                className="group-hover:rotate-90 group-hover:-translate-x-3 transition-transform duration-300 ease-in-out text-neutral-100 dark:text-secDark"
            />
            <span className="text-[12px] sm:text-[13px] text-neutral-100 dark:text-secDark font-medium tracking-wide">
                Create Channel
            </span>
        </div>
    );
}
