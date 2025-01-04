import { allOrganizationDisplaytype, DisplayType, userSessionAtom } from "@/recoil/atoms/atom"
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";
import { fetchOrganization } from "fetch/fetchOrganizations"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import CardHoverChatCards from "../ui/CardHoverChatCards";
import DashboardComponentHeading from "./DashboardComponentHeading";
import ListTypeOrganizations from "../ui/ListTypeOrganizations";
import OrganizationDisplayTypeToggleButton from "../buttons/OrganizationDisplayTypeToggleButton";
import { OrganizationType } from "types";

export default function () {
    const session = useRecoilValue(userSessionAtom);
    const [ownedOrganizations, setOwnedOrganizations] = useRecoilState<OrganizationType[]>(userCreatedOrganizationAtom);
    const displayType = useRecoilValue<DisplayType>(allOrganizationDisplaytype);
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
            <OrganizationDisplayTypeToggleButton />
            <DashboardComponentHeading className="pt-4 pl-12" description="Browse through all the organizations owned by you">Owned by you</DashboardComponentHeading>
            <div className="bg-[#37474f] dark:bg-[#262629] my-8 mx-12 py-4 rounded-[8px] shadow-lg shadow-black/40 flex-grow overflow-hidden ">
                {loading ?
                    (<HomeOrganizationsSkeleton />) :
                    (
                        displayType === DisplayType.list ? <ListTypeOrganizations organizations={ownedOrganizations} />
                            : <CardHoverChatCards className="py-8" organizations={ownedOrganizations} />
                    )
                }
            </div>
        </div>
    )
}