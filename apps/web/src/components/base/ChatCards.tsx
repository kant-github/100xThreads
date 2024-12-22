"use client";

import CardHoverChatCards from "../ui/CardHoverChatCards";
import { IoIosArrowForward } from "react-icons/io";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationType } from "types";
import { organizationsAtom } from "@/recoil/atoms/organizationsAtom";
import { useEffect } from "react";
import { fetchAllOrganization } from "fetch/fetchOrganizations";
import { userTokenAtom } from "@/recoil/atoms/atom";

export default function () {

  const [organizations, setOrganizations] = useRecoilState<OrganizationType[] | []>(organizationsAtom);
  const token = useRecoilValue(userTokenAtom);

  useEffect(() => {
    const fetchCall = async () => {
      if (token) {
        const data = await fetchAllOrganization(token);
        setOrganizations(data);
      }
    }
    fetchCall();
  }, [token]);


  return (
    <div className="bg-[#37474f] dark:bg-[#141313] pt-6 pb-16">
      {organizations && organizations.length > 0 ? (
        <>
          <span className="inline-flex items-center justify-start select-none gap-x-2 text-white text-xs font-extralight ml-48 mb-3 tracking-wide group italic cursor-pointer dark:text-gray-200" >
            organizations
            <IoIosArrowForward className="mt-[2px] transition-transform transform group-hover:translate-x-[2px]" />
          </span>
          <CardHoverChatCards organizations={organizations} />
        </>
      ) : (
        <div className="text-center text-gray-400 text-sm mt-4">No rooms available to show.</div>
      )}
    </div>
  );
}
