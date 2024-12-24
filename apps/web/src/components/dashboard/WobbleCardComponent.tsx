import Image from "next/image";
import { WobbleCard } from "../ui/wobble-card";

export default function () {
    return (
        <div className="w-[70%]">
            <WobbleCard
                containerClassName="col-span-5 h-[250px] bg-zinc-800"
                className="">
                <div className="max-w-xs">
                    <h2 className="text-left font-extrabold text-balance text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-white">
                        100<span className="text-red-500">x</span>Threads
                    </h2>
                    <p className="mt-4 ml-2 w-52 text-left text-[13px] text-zinc-100">
                        <ul className="list-disc flex flex-col gap-y-1">
                            <li>Event scheduling</li>
                            <li>Google Calendar Integration</li>
                            <li>Multiple Channels</li>
                            <li>Role based access</li>
                        </ul>
                    </p>
                </div>
                <Image src="/images/dashImage.jpeg" width={450} height={450} alt="linear demo image" className="absolute -right-4 lg:-right-[50%] grayscale filter -bottom-24 object-contain rounded-2xl" />
            </WobbleCard>
        </div>
    )
}