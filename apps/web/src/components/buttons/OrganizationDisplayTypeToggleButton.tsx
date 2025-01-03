import { allOrganizationDisplaytype, DisplayType } from "@/recoil/atoms/atom";
import { FaList } from "react-icons/fa6";
import { HiViewGridAdd } from "react-icons/hi";
import { useRecoilState } from "recoil";

export default function ViewToggle() {
    const [displayType, setDisplayType] = useRecoilState<DisplayType>(allOrganizationDisplaytype);

    return (
        <div className="flex items-center bg-zinc-800/30 rounded-[8px] absolute top-6 right-12 border-[0.5px] border-zinc-600 overflow-hidden">
            <button
                type="button"
                onClick={() => setDisplayType(DisplayType.grid)}
                className={`p-1.5 rounded-[6px] transition-all duration-200 ${displayType === DisplayType.grid
                    ? 'bg-zinc-900 text-yellow-400/70 shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
                    }`}
            >
                <HiViewGridAdd size={16} />
            </button>
            <button
                type="button"
                onClick={() => setDisplayType(DisplayType.list)}
                className={`p-1.5 rounded-[6px] transition-all duration-200 ${displayType === DisplayType.list
                    ? 'bg-zinc-900 text-yellow-400/70 shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
                    }`}
            >
                <FaList size={16} />
            </button>
        </div>
    );
}