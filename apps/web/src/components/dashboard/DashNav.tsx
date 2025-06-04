"use client";
import { useEffect, useState } from "react";
import SearchInput from "../utility/SearchInput";
import ProfileDropDown from "./ProfileDropDown";
import axios from "axios";
import { ORGANIZATION_AND_USER_SEARCH } from "@/lib/apiAuthRoutes";
import { OrganizationType, UserType } from "types/types";
import SearchResultDialogBox from "../utility/SearchResultDialogBox";
import AppLogo from "../heading/AppLogo";
import { WhiteBtn } from "../buttons/WhiteBtn";
import Version from "../buttons/Version";
import Greetings from "../utility/Greetings";
import CreateRoomForm from "./CreateOrganizationForm";
import { MdKeyboardControlKey } from "react-icons/md";
import { TbLetterK } from "react-icons/tb";
import { createOrganizationAtom, userSessionAtom } from "@/recoil/atoms/atom";
import { useRecoilState, useRecoilValue } from "recoil";


export default function DashNav() {
  const [searchInput, setSearchInput] = useState("");
  const [usersList, setUsersList] = useState<UserType[] | []>([]);
  const [organizationsList, setOrganizationsList] = useState<OrganizationType[]>([]);
  const [open, setOpen] = useRecoilState(createOrganizationAtom);
  const [searchResultDialogBox, setSearchResultDialogBox] = useState<boolean>(false);
  const session = useRecoilValue(userSessionAtom);

  async function getSearchInputChatGroups() {
    try {
      const response = await axios.get(`${ORGANIZATION_AND_USER_SEARCH}?name=${searchInput}`, {
        headers: {
          authorization: `Bearer ${session.user?.token}`,
        },
      });

      setUsersList(response.data.users);
      setOrganizationsList(response.data.organizations);
    } catch (err) {
      console.error("Error in searching chat groups:", err);
    }
  }


  useEffect(() => {
    const debouncedTimeout = setTimeout(() => {
      if (searchInput) {
        getSearchInputChatGroups();
      }
    }, 1000);

    return () => {
      clearTimeout(debouncedTimeout);
    };
  }, [searchInput]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === "K") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <div className="flex bg-light dark:bg-dark flex-row justify-between items-center w-full h-full px-8 border-b border-neutral-300 dark:border-zinc-700 dark:shadow-[40px]">
      <div className="flex items-center gap-x-2">
        <AppLogo />
        <Version />
      </div>
      <div className="flex flex-row justify-center items-center gap-x-6">
        <Greetings />
        <WhiteBtn onClick={() => setOpen(true)}>
          <span className="flex items-center gap-x-2">
            <span>Create Org</span>
            <span className="flex flex-row gap-x-1">
              <MdKeyboardControlKey size={18} className="border-[1px] p-[2px] dark:border-zinc-800 rounded-[2px]" />
              <TbLetterK size={18} className="border-[1px] p-[2px] dark:border-zinc-800 rounded-[2px]" />
            </span>
          </span>
        </WhiteBtn>
        <div className="w-[340px]">
          <SearchInput
            setSearchResultDialogBox={setSearchResultDialogBox}
            input={searchInput}
            setInput={setSearchInput}
          />
          {searchResultDialogBox && (
            <SearchResultDialogBox
              searchResultDialogBox={searchResultDialogBox}
              setSearchResultDialogBox={setSearchResultDialogBox}
              usersList={usersList}
              organizationsList={organizationsList}
            />
          )}
        </div>
        <ProfileDropDown />
        <CreateRoomForm open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
