"use client";
import { useEffect, useState } from "react";
import SearchInput from "../utility/SearchInput";
import ProfileDropDown from "./ProfileDropDown";
import axios from "axios";
import { CHAT_GROUP } from "@/lib/apiAuthRoutes";
import { GroupChatType } from "types";
import SearchResultDialogBox from "../utility/SearchResultDialogBox";
import AppLogo from "../heading/AppLogo";
import { MdLightMode } from "react-icons/md";
import BlackBtn from "../buttons/BlackBtn";

interface props {
    groups: any;
}

export default function NavBar({ groups }: props) {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<GroupChatType[] | []>([]);
    const [searchResultDialogBox, setSearchResultDialogBox] = useState<boolean>(false);

    async function getSearchInputChatGroups() {
        try {
            const response = await axios.get(`${CHAT_GROUP}-by-search?group_id=${searchInput}`);
            console.log("Search results:", response.data.data);
            setSearchResults(response.data.data);
        } catch (err) {
            console.error("Error in searching chat groups:", err);
        }
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
        <div className="flex bg-[white] flex-row justify-between items-center w-full px-8 h-16 border-b">
            <div className="flex-shrink-0">
                <AppLogo />
            </div>
            <div className="flex flex-row justify-center items-center gap-x-4">
                <div className="flex items-center flex-row gap-x-6 w-3/12">
                    <BlackBtn onClick={() => (console.log(true))}>Docs</BlackBtn>
                    <MdLightMode className="cursor-pointer" color="black" size={32} />
                </div>
                <div className="w-[150px] sm:w-[300px] lg:w-[350px]">
                    <SearchInput setSearchResultDialogBox={setSearchResultDialogBox} input={searchInput} setInput={setSearchInput} />
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
