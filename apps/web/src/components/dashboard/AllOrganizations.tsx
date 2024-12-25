"use client";
import { FaList } from "react-icons/fa";
import { HiViewGridAdd } from "react-icons/hi";
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
    <div className="bg-[#37474f] dark:bg-[#141313] h-full relative">
      <div className="flex flex-row items-center gap-x-3 px-2 py-1 absolute top-6 right-12 dark:bg-zinc-600/30 rounded-[4px]">
        <HiViewGridAdd size={22} className="text-zinc-400" />
        <FaList size={19} className="text-zinc-400" />
      </div>
      <DashboardComponentHeading className="pt-4 pl-12" description="Browse through the organizations which previously joined">All organizations</DashboardComponentHeading>
      <div className="bg-[#37474f] dark:bg-[#262629] mt-8 pt-8 mx-12 h-[48%] overflow-auto scrollbar-hide rounded-[8px] shadow-lg shadow-black/40">
        {!loading ?
          (<CardHoverChatCards organizations={organizations} />) :
          (<HomeOrganizationsSkeleton />)
        }
      </div>
    </div>
  );
}
