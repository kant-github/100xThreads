"use client";

import CardHoverChatCards from "../ui/CardHoverChatCards";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationType } from "types";
import { organizationsAtom } from "@/recoil/atoms/organizationsAtom";
import { useEffect, useState } from "react";
import { fetchAllOrganization } from "fetch/fetchOrganizations";
import { userSessionAtom } from "@/recoil/atoms/atom";
import HomeOrganizationsSkeleton from "../skeletons/HomeOrganizationsSkeleton";
import DashboardComponentHeading from "./DashboardComponentHeading";


export default function () {

  const [organizations, setOrganizations] = useRecoilState<OrganizationType[] | []>(organizationsAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useRecoilValue(userSessionAtom);

  useEffect(() => {
    const fetchCall = async () => {
      setLoading(true);
      await new Promise(t => setTimeout(t, 500));
      if (session.user?.token) {
        const data = await fetchAllOrganization(session.user.token);
        setOrganizations(data);
      }
      setLoading(false);
    }
    fetchCall();
  }, [session.user?.token]);


  return (
    <div className="bg-[#37474f] dark:bg-[#141313] h-full">
      <DashboardComponentHeading className="pt-4 pl-12" description="Browse through the organi¯tions which previously joined">All organizations</DashboardComponentHeading>
      <div className="bg-[#37474f] dark:bg-[#141313] mt-8">
                {!loading ?
                    (<CardHoverChatCards organizations={organizations} />) :
                    (<HomeOrganizationsSkeleton />)
                }
            </div>
    </div>
  );
}
