import Image from "next/image";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { AnimatedTooltipPreview } from "../../utility/AnimatedTooltipPreview";
import DashboardsMetrics from "../../ui/DashboardsMetrics";
import UnclickableTicker from "../../ui/UnclickableTicker";
import { ImFire } from "react-icons/im";
import { StickyScrollRevealDemo } from "../../ui/StickyScrollReveal";
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import { OrganizationUsersType } from "types/types";

export default function () {
    const organization = useRecoilValue(organizationAtom);
    const organizationUsers = useRecoilValue(organizationUsersAtom);
    const previewUsers = organizationUsers.filter((user: OrganizationUsersType) => (user.role === 'ADMIN' || user.role === 'MEMBER' || user.role === 'GUEST'))
    return (
        <div className="h-full bg-neutral-900 flex flex-col items-start w-full p-8 relative">
            <div className="flex flex-row justify-start items-center gap-x-3 border-b-[0.5px] border-zinc-700 pb-6 w-full">
                <Image className="rounded-[14px]" width={80} height={120} src={"/images/100xDevs-logo.png"} alt="logo" />
                <div className="flex flex-col items-start justify-end text-neutral-50 w-full">
                    <span className="text-4xl font-black tracking-wide">{organization?.name}</span>
                    <span className="text-xs tracking-wide font-light">{organization?.description}</span>
                </div>
            </div>
            <DashboardsMetrics className="mt-8 w-full" />
            <AnimatedTooltipPreview className="mt-4" users={previewUsers} />
            <UnclickableTicker className="items-center mb-1 mx-auto">
                <ImFire />
                Featured section
            </UnclickableTicker>
            <StickyScrollRevealDemo />

        </div>
    )
}