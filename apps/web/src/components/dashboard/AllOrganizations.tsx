"use client";
import CardHoverChatCards from "../ui/CardHoverChatCards";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationType } from "types";
import { organizationsAtom } from "@/recoil/atoms/organizationsAtom";
import { useEffect, useState } from "react";
import { fetchAllOrganization } from "fetch/fetchOrganizations";
import { allOrganizationDisplaytype, DisplayType, userSessionAtom } from "@/recoil/atoms/atom";
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import DashboardComponentHeading from "./DashboardComponentHeading";
import ListTypeOrganizations from "../ui/ListTypeOrganizations";
import OrganizationDisplayTypeToggleButton from "../buttons/OrganizationDisplayTypeToggleButton";
import ListTypeOrganizationSkeleton from "../skeletons/ListTypeOrganizationSkeleton";
import EmptyOrganizationMessage from "../buttons/EmptyOrganizationMessage";

export default function () {

  const [organizations, setOrganizations] = useRecoilState<OrganizationType[] | []>(organizationsAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useRecoilValue(userSessionAtom);
  const displayType = useRecoilValue<DisplayType>(allOrganizationDisplaytype);


  useEffect(() => {
    const fetchCall = async () => {
      setLoading(true);
      await new Promise(t => setTimeout(t, 1000));
      if (session.user?.token) {
        const data = await fetchAllOrganization(session.user.token);
        setOrganizations(data);
      }
      setLoading(false);
    }
    fetchCall();
  }, [session.user?.token]);


  return (
    <div className="bg-[#37474f] dark:bg-[#141313] h-full relative flex flex-col">
      <OrganizationDisplayTypeToggleButton />
      <DashboardComponentHeading className="pt-4 pl-12" description="Browse through the organizations which previously joined">All organizations</DashboardComponentHeading>
      <div className="bg-[#37474f] dark:bg-[#262629] my-8 mx-12 rounded-[8px] shadow-lg shadow-black/40 flex-grow overflow-hidden ">
                {loading ? (
                    displayType === DisplayType.list ?
                        <ListTypeOrganizationSkeleton /> :
                        <HomeOrganizationsSkeleton />
                ) : (
                    (!organizations || organizations.length === 0) ?
                        <EmptyOrganizationMessage /> :
                        displayType === DisplayType.list ?
                            <ListTypeOrganizations organizations={organizations} /> :
                            <CardHoverChatCards className="py-8" organizations={organizations} />
                )}
            </div>
    </div>
  );
}
