import { Dispatch, SetStateAction, useState } from "react"
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { protectedOrganizationMetadata } from "app/org/[id]/page";
import Image from "next/image";
import CompanyTagTicker from "../utility/CompanyTagTicker";
import { format } from 'date-fns'
import crypto from 'crypto-js';
import InputBox from "../utility/InputBox";
import AppLogo from "../heading/AppLogo";
import { MdOutlineArrowRight } from "react-icons/md";
import axios from "axios";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import Spinner from "../loaders/Spinner";
import { organizationChannels, organizationEventChannels, organizationWelcomeChannel } from "@/recoil/atoms/organizationMetaDataAtom";

interface props {
    metaData: protectedOrganizationMetadata,
    organizationId: string,
    setFlag: Dispatch<SetStateAction<'PROTECTED' | 'ALLOWED' | 'INIT'>>
}

export default function ({ metaData, organizationId, setFlag }: props) {
    const [loading, setLoading] = useState<boolean>(false);
    const session = useRecoilValue(userSessionAtom);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const setEventChannel = useSetRecoilState(organizationEventChannels)
    const setChannels = useSetRecoilState(organizationChannels)
    const setWelcomeChannel = useSetRecoilState(organizationWelcomeChannel)
    const date = metaData.created_at ? format(new Date(metaData.created_at), 'MMMM dd, yyyy') : null;

    const clickHandler = async () => {
        setLoading(true);
        const salt = metaData.passwordSalt;
        const combinedPass = password + salt;
        const hashedPassword = crypto.SHA256(combinedPass).toString();
        if (!session.user?.token || !organizationId) {
            console.log("returning");
            return;
        }
        try {
            const { data } = await axios.post(`${ORGANIZATION}/join-by-passcode/${organizationId}`, {
                password: `${salt}:${hashedPassword}`
            }, {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`
                }
            });
            if (data.flag === 'ALLOWED') {
                setFlag('ALLOWED')
                const { eventChannel, channels, welcomeChannel } = data.data
                setEventChannel(eventChannel)
                setChannels(channels)
                setWelcomeChannel(welcomeChannel)
            } else {
                setError('wrong password');
                setFlag('PROTECTED');
            }

            setLoading(false);
        } catch (err) {
            console.log("some error");
            setLoading(false);
        }
    }

    return (
        <div className="h-[50rem] w-full bg-white dark:bg-[#171717] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
            <OpacityBackground>
                <UtilityCard className="w-5/12 px-12 relative py-8 flex flex-col items-start justify-center">
                    <div className="rounded-[12px] mt-4 absolute top-0 right-4" style={{ backgroundColor: `${metaData.organizationColor}` }}>
                        <Image src="/images/protected.png" width={80} height={40} alt="empty" className="p-3" />
                    </div>
                    <DashboardComponentHeading description={metaData.description}>
                        {metaData.name}
                    </DashboardComponentHeading>
                    <div className="flex flex-col justify-start gap-y-3 mt-8 w-full">
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
                        {
                            !loading ? (
                                <form onSubmit={clickHandler} className="mt-4 w-full">
                                    <div className="flex items-center justify-start gap-x-4">
                                        <InputBox label="Enter organization password" error={error} onChange={setPassword}></InputBox>
                                        <button type="submit" aria-label="button" style={{ backgroundColor: `${metaData.organizationColor}` }} className="mt-5 rounded-[8px] group">
                                            <MdOutlineArrowRight size={40} className="p-1 font-thin text-zinc-900 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mt-4 w-full text-xs text-zinc-900 font-semibold flex flex-row items-center justify-center gap-x-3 py-2.5 rounded-[6px]" style={{ backgroundColor: `${metaData.organizationColor}B3` }} >
                                    <span>
                                        <Spinner size="3" />
                                    </span>
                                    loading...
                                </div>
                            )
                        }
                        <div className="flex">
                            <AppLogo className={"mt-2"} />
                        </div>
                    </div>
                </UtilityCard>
            </OpacityBackground>
        </div>
    );
}