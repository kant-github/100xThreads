"use client";
import { useEffect, useState } from "react";
import SearchInput from "../utility/SearchInput";
import ProfileDropDown from "./ProfileDropDown";
import axios from "axios";
import { CHAT_GROUP } from "@/lib/apiAuthRoutes";
import { ChatGroupType } from "types";
import SearchResultDialogBox from "../utility/SearchResultDialogBox";
import AppLogo from "../heading/AppLogo";
import { useSession } from "next-auth/react";
import { WhiteBtn } from "../buttons/WhiteBtn";
import Version from "../buttons/Version";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { globalRoomHandler } from "@/lib/globalRoomHandler";
import Greetings from "../utility/Greetings";
import { GoPlus } from "react-icons/go";
import CreateRoomForm from "./CreateRoomForm";
import { MdKeyboardControlKey } from "react-icons/md";
import { TbLetterK } from "react-icons/tb";

interface Props {
  groups: any;
}

export const globalGroupId: string = "d023e34a-3aaf-46f4-88b5-b38b2ec6cffe";
export default function Header({ groups }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<ChatGroupType[] | []>([]);
  const [createRoomFormDialogBox, setCreateRoomFormDialogBox] = useState<boolean>(false);
  const [searchResultDialogBox, setSearchResultDialogBox] = useState<boolean>(false);
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check for Ctrl + K
      if (event.ctrlKey && event.key === "K") {
        event.preventDefault();
        setCreateRoomFormDialogBox((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <div className="flex bg-white dark:bg-[#171717] flex-row justify-between items-center w-full h-full px-8 border-b dark:border-zinc-700 dark:shadow-[40px]">
      <div className="flex items-center gap-x-2">
        <AppLogo />
        <Version />
      </div>
      <div className="flex flex-row justify-center items-center gap-x-6">
        <Greetings />
        <WhiteBtn onClick={() => setCreateRoomFormDialogBox(true)}>
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
              searchResults={searchResults}
            />
          )}
        </div>
        <ProfileDropDown groups={groups} />
        <CreateRoomForm open={createRoomFormDialogBox} setOpen={setCreateRoomFormDialogBox} />
      </div>
    </div>
  );
}
