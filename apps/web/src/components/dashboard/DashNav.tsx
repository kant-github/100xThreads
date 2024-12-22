"use client";
import { useEffect, useState } from "react";
import SearchInput from "../utility/SearchInput";
import ProfileDropDown from "./ProfileDropDown";
import axios from "axios";
import { CHAT_GROUP } from "@/lib/apiAuthRoutes";
import { ChatGroupType } from "types";
import SearchResultDialogBox from "../utility/SearchResultDialogBox";
import AppLogo from "../heading/AppLogo";
import DarkMode from "../base/DarkMode";
import { useSession } from "next-auth/react";
import { Cedarville_Cursive } from "next/font/google";
import { WhiteBtn } from "../buttons/WhiteBtn";
import Version from "../buttons/Version";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { globalRoomHandler } from "@/lib/globalRoomHandler";
import Greetings from "../utility/Greetings";

const font = Cedarville_Cursive({ weight: "400", subsets: ["latin"] });

interface Props {
  groups: any;
}

export const globalGroupId: string = "d023e34a-3aaf-46f4-88b5-b38b2ec6cffe";
export default function Header({ groups }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<ChatGroupType[] | []>([]);
  const [searchResultDialogBox, setSearchResultDialogBox] =
    useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  async function getSearchInputChatGroups() {
    try {
      const response = await axios.get(
        `${CHAT_GROUP}-by-search?group_id=${searchInput}`
      );
      setSearchResults(response.data.data);
    } catch (err) {
      console.error("Error in searching chat groups:", err);
    }
  }

  async function globalRoomButtonHandler() {
    if (!session?.user.id) {
      toast.error("User not authenticated");
      return;
    }
    await globalRoomHandler(globalGroupId, session.user.id, router);
  }

  useEffect(() => {
    const debouncedTimeout = setTimeout(() => {
      if (searchInput) {
        getSearchInputChatGroups();
      }
    }, 500);

    return () => {
      clearTimeout(debouncedTimeout);
    };
  }, [searchInput]);

  return (
    <div className="flex bg-white h-16 dark:bg-[#171717] flex-row justify-between items-center w-full px-8 border-b dark:border-zinc-700 dark:shadow-[40px]">
      <div className="flex items-center gap-x-2">
        <AppLogo />
        <Version />
      </div>
      <div className="flex flex-row justify-center items-center gap-x-6">
        <Greetings/>
        <WhiteBtn onClick={globalRoomButtonHandler}>Global room</WhiteBtn>
        <DarkMode />
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
              searchResults={searchResults}
            />
          )}
        </div>
        <ProfileDropDown groups={groups} />
      </div>
    </div>
  );
}
