import { GiJigsawPiece } from "react-icons/gi";
import { useRouter } from "next/navigation";
// import { Afacad } from "next/font/google"
// const font = Afacad({
//     subsets: ['latin'],
//     weight: '700',
//     display: 'swap',
// });

type props = {
    className?: string | null
}

export default function ({className}: props) {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                router.push("/dashboard");
            }}
            className={`flex flex-row gap-x-5 items-center ml-2 cursor-pointer select-none group ${className}`}>
            <GiJigsawPiece
                size={30}
                className="transition-transform transform group-hover:-translate-x-[3px] text-[#f2a633] dark:text-[#f2a633]"
            />
            <div
                className={`text-xl md:text-2xl tracking-widest text-black dark:text-gray-300 flex items-center font-afacad`}>
                100 <span className="text-red-500">x</span> Threads
            </div>
        </div>
    );
}
