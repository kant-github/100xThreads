import Image from "next/image";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { AnimatedTooltipPreview } from "../utility/AnimatedTooltipPreview";
import DashboardsMetrics from "../ui/DashboardsMetrics";
import UnclickableTicker from "../ui/UnclickableTicker";
import { ImFire } from "react-icons/im";
import { StickyScrollRevealDemo } from "../ui/StickyScrollReveal";

export default function () {
    const organization = useRecoilValue(organizationAtom);
    return (
        <div className="h-full bg-neutral-900 flex flex-col items-start w-full p-8 relative">
            <div className="flex flex-row justify-start items-center gap-x-3 border-b-[0.5px] border-zinc-700 pb-6 w-full">
                <Image className="rounded-[14px]" width={80} height={120} src={"/images/amazonlogo.png"} alt="logo" />
                <div className="flex flex-col items-start justify-end text-neutral-50 w-full">
                    <span className="text-4xl font-black tracking-wide">{organization?.name}</span>
                    <span className="text-xs tracking-wide font-light">{organization?.description}</span>
                </div>
            </div>
            <DashboardsMetrics className="mt-8 w-full" />
            <UnclickableTicker className="items-center mt-10 mb-1">
                <ImFire />
                Featured section
            </UnclickableTicker>
            <StickyScrollRevealDemo />
            <AnimatedTooltipPreview className="mt-12" />
            
        </div>
    )
}