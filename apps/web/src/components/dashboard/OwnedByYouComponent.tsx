import { userSessionAtom } from "@/recoil/atoms/atom"
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";
import { fetchOrganization } from "fetch/fetchOrganizations"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import CardHoverChatCards from "../ui/CardHoverChatCards";
import DashboardComponentHeading from "./DashboardComponentHeading";
import { HiViewGridAdd } from "react-icons/hi";
import { FaList } from "react-icons/fa6";

export default function () {
    const session = useRecoilValue(userSessionAtom);
    const [ownedOrganizations, setOwnedOrganizations] = useRecoilState(userCreatedOrganizationAtom);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        async function fetchUserCreatedOrganization() {
            setLoading(true);
            await new Promise(t => setTimeout(t, 500));
            if (session.user?.token) {
                const ownedOrganization = await fetchOrganization(session.user.token);
                setOwnedOrganizations(ownedOrganization);

            }
            setLoading(false);
        }
        fetchUserCreatedOrganization();
    }, [session.user?.token])

    return (
        <div className="h-full bg-[#141313] relative">
            <div className="flex flex-row items-center gap-x-3 px-2 py-1 absolute top-6 right-12 dark:bg-zinc-600/30 rounded-[4px]">
                <HiViewGridAdd size={22} className="text-zinc-400" />
                <FaList size={19} className="text-zinc-400" />
            </div>
            <DashboardComponentHeading className="pt-4 pl-12" description="Browse through all the organizations you own">Owned by you</DashboardComponentHeading>
            <div className="bg-[#37474f] dark:bg-[#262629] mt-8 pt-8 mx-12 h-[48%] overflow-auto rounded-[8px] shadow-lg shadow-black/40">
                {!loading ?
                    (<CardHoverChatCards organizations={ownedOrganizations} />) :
                    (<HomeOrganizationsSkeleton />)
                }
            </div>
        </div>
    )
}