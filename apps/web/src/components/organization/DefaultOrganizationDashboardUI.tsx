import Image from "next/image";
import BlackboardBackground from "../ui/BlackboardBackground";
import UtilityCard from "../utility/UtilityCard";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { AnimatedTooltipPreview } from "../utility/AnimatedTooltipPreview";
import DashboardsMetrics from "../ui/DashboardsMetrics";
import { StickyScrollRevealDemo } from "../ui/StickyScrollReveal";

export default function () {
    const organization = useRecoilValue(organizationAtom);
    return (
        <div className="bg-[#171717] h-full flex flex-col items-start w-full p-6 relative">
            <UtilityCard className="w-full p-8 flex-grow overflow-hidden">
                <div className="flex flex-row justify-start items-center gap-x-3 border-b-[0.5px] border-zinc-700 pb-6">
                    <Image className="rounded-[14px]" width={80} height={120} src={"/images/amazonlogo.png"} alt="logo" />
                    <div className="flex flex-col items-start justify-end">
                        <span className="text-4xl font-black tracking-wide">{organization?.name}</span>
                        <span className="text-xs tracking-wide font-light">{organization?.description}</span>
                    </div>
                </div>
                <DashboardsMetrics className="mt-8" />
                <AnimatedTooltipPreview className="mt-12" />
                {/* <StickyScrollRevealDemo /> */}
            </UtilityCard>
        </div>
    )
}