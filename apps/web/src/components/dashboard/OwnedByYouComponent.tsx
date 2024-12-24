import { userSessionAtom } from "@/recoil/atoms/atom"
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";
import { fetchOrganization } from "fetch/fetchOrganizations"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import CardHoverChatCards from "../ui/CardHoverChatCards";
import Heading from "../heading/Heading";

export default function () {
    const session = useRecoilValue(userSessionAtom);
    const [ownedOrganizations, setOwnedOrganizations] = useRecoilState(userCreatedOrganizationAtom);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        async function fetchUserCreatedOrganization() {
            setLoading(true);
            // await new Promise(t => setTimeout(t, 5000));
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
            <Heading>Organizations owned by you</Heading>
            <div className="bg-[#37474f] dark:bg-[#141313] py-8">
                {!loading ?
                    (<CardHoverChatCards organizations={ownedOrganizations} />) :
                    (<HomeOrganizationsSkeleton />)
                }
            </div>
        </div>
    )
}