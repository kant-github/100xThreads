import Image from "next/image";
import { Barriecito } from "next/font/google";
const font = Barriecito({ weight: "400", subsets: ["latin"] })

export default function () {
    return (
        <div className="h-[30%] w-full mt-auto flex flex-row gap-x-4 p-4">
            <button aria-label="issue-button" type="button" className="border-2 border-dashed border-neutral-500/50 text-neutral-400 rounded-[14px] flex-1 flex items-center justify-center text-md gap-2 py-8 hover:border-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/30 transition-all duration-300 group font-light" >
                <span className=" text-xl font-light group-hover:scale-110 transition-transform duration-300">+</span>
                    raise an issue
            </button>
            <div className="relative rounded-[16px] flex-1">
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
        </div>
    )
}