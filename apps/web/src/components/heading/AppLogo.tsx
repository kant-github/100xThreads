import { GiDoubleDragon } from "react-icons/gi";
import { useRouter } from "next/navigation";


type props = {
    className?: string | null
}

export default function ({ className }: props) {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                router.push("/dashboard");
            }}
            className={`flex flex-row gap-x-3 items-center ml-2 cursor-pointer select-none group ${className}`}>
            <GiDoubleDragon
                size={30}
                className="transition-transform transform group-hover:-translate-x-[3px] text-[#f2a633] dark:text-[#f2a633]"
            />
            <div
                className={`text-xl md:text-2xl tracking-widest text-black dark:text-gray-300 flex items-center font-afacad`}>
                Shelv<span className="text-red-500">R</span>
            </div>
        </div>
    );
}
