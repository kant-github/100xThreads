import { useState } from "react"
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { protectedOrganizationMetadata } from "app/org/[id]/page";
import Image from "next/image";
import CompanyTagTicker from "../utility/CompanyTagTicker";
import { format } from 'date-fns'
import InputBox from "../utility/InputBox";

interface props {
    metaData: protectedOrganizationMetadata
}

export default function ({ metaData }: props) {
    const [password, setPassword] = useState('')
    const date = metaData.created_at ? format(new Date(metaData.created_at), 'MMMM dd, yyyy') : null;

    return (
        <div className="h-[50rem] w-full bg-white dark:bg-[#171717] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
            <OpacityBackground>
                <UtilityCard className="w-5/12 px-12 relative py-8 flex flex-col items-start justify-center">
                    <div className="rounded-[12px] mt-4 absolute top-0 right-4" style={{ backgroundColor: `${metaData.organizationColor}B3` }}>
                        <Image src="/images/protected.png" width={80} height={40} alt="empty" className="p-3" />
                    </div>
                    <DashboardComponentHeading description={metaData.description}>
                        {metaData.name}
                    </DashboardComponentHeading>
                    <div className="flex flex-col justify-start gap-y-3 mt-8">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs text-zinc-300 tracking-wide">Owned by </span>
                            <div className="text-xs dark:text-zinc-200 font-semibold border-[0.5px] border-zinc-600 py-1 px-2 md:px-3 rounded-[8px] dark:bg-zinc-800/20 dark:hover:bg-zinc-500/40 truncate max-w-[120px] sm:max-w-none cursor-pointer">{metaData.owner.name}</div>
                        </div>
                        <div className="text-xs text-zinc-300 tracking-wide">Organization created at {date}</div>
                        <div className="flex flex-row gap-x-2 md:gap-x-3 text-xs flex-wrap">
                            {
                                metaData.tags.map((tag, tagIndex) => (
                                    <CompanyTagTicker color={metaData.organizationColor} key={tagIndex}>{tag}</CompanyTagTicker>
                                ))
                            }
                        </div>
                        <div className="mt-4">
                            <span className="text-[12px] text-zinc-300 ml-1 tracking-wide">Enter organization password</span>
                            <div className="flex items-center justify-start gap-x-4">
                                <InputBox onChange={setPassword}></InputBox>
                            </div>
                        </div>
                    </div>
                </UtilityCard>
            </OpacityBackground>
        </div>
    );
}