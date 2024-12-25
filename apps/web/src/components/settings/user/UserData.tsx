import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { userSessionAtom } from "@/recoil/atoms/atom";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import WhiteText from "@/components/heading/WhiteText";

export default function () {
    const session = useRecoilValue(userSessionAtom);
    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-x-4">
                <Image src={session.user?.image!} width={60} height={40} alt="user-image" className="rounded-full" />
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-x-2">
                        <div className="text-lg font-medium">{"Rishi Kant"}</div>
                        <div className="flex items-center gap-x-1 text-green-500 text-[11px] "><IoIosCheckmarkCircleOutline size={14} /> {" "} Active</div>
                    </div>
                    <div>
                        <WhiteText className="text-xs">Delhi, India</WhiteText>
                    </div>
                </div>
                
            </div>
            
            <div className="flex items-center justify-start gap-x-4 mt-3">
                <WhiteText className="text-xs px-3 py-1 rounded-[4px] border-[1px] border-zinc-600">{"Faraaz aao sitaare safar ke dekhte hai 🌻"}</WhiteText>
                <WhiteText className="text-xs px-3 py-1 rounded-[4px] border-[1px] border-zinc-600">{session.user?.email}</WhiteText>
            </div>
        </div>
    )
}