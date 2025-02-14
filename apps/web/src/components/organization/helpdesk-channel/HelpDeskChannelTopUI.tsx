import Image from "next/image";
import { Barriecito } from "next/font/google";
const font = Barriecito({ weight: "400", subsets: ["latin"] })

export default function () {
    return (
        <div className="relative rounded-[16px] h-[30%] w-full">
            <Image
                height={20}
                width={1400}
                alt="help desk banner"
                src={"/images/announcement.png"}
                className="rounded-[16px] object-cover h-full w-full"
            />
            <div className="absolute inset-0 bg-black/40 rounded-[16px]"></div>
            <div className={`text-2xl w-full mx-auto flex justify-center font-black tracking-widest leading-[24px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 z-20 select-none ${font.className}`}>
                HELP DESK CHANNEL
            </div>
        </div>
    )
}