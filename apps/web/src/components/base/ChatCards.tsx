"use client";

import CardHoverChatCards from "../ui/CardHoverChatCards";
import { IoIosArrowForward } from "react-icons/io";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationType } from "types";
import { organizationsAtom } from "@/recoil/atoms/organizationsAtom";
import { useEffect } from "react";
import { fetchAllOrganization } from "fetch/fetchOrganizations";
import { userSessionAtom } from "@/recoil/atoms/atom";


export default function () {

  const [organizations, setOrganizations] = useRecoilState<OrganizationType[] | []>(organizationsAtom);
  const session = useRecoilValue(userSessionAtom);

  useEffect(() => {
    const fetchCall = async () => {
      if (session.user?.token) {
        const data = await fetchAllOrganization(session.user.token);
        setOrganizations(data);
      }
    }
    fetchCall();
  }, [session.user?.token]);

  console.log("organizations are in dashboard is : ", organizations);

  return (
    <div className="bg-[#37474f] dark:bg-[#141313] py-8">
      {organizations && organizations.length > 0 ? (
        <>
          <CardHoverChatCards organizations={organizations} />
        </>
      ) : (
        <div className="text-center text-gray-400 text-sm mt-4">No rooms available to show.</div>
      )}
    </div>
  );
}
