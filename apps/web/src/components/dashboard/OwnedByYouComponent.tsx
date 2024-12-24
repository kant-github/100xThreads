import { userSessionAtom } from "@/recoil/atoms/atom"
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";
import { fetchOrganization } from "fetch/fetchOrganizations"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import CardHoverChatCards from "../ui/CardHoverChatCards";
import DashboardComponentHeading from "./DashboardComponentHeading";

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
        <div className="h-full bg-[#141313]">
            <DashboardComponentHeading className="pt-4 pl-12" description="Browse through all the organizations you own">Owned by you</DashboardComponentHeading>
            <div className="bg-[#37474f] dark:bg-[#141313] mt-8">
                {!loading ?
                    (<CardHoverChatCards organizations={ownedOrganizations} />) :
                    (<HomeOrganizationsSkeleton />)
                }
            </div>
        </div>
    )
}