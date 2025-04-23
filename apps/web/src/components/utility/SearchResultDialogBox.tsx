"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { OrganizationType } from "types/types";

interface SearchResultDialogBoxProps {
    searchResultDialogBox: boolean;
    setSearchResultDialogBox: Dispatch<SetStateAction<boolean>>;
    searchResults: OrganizationType[];
}

export default function SearchResultDialogBox({ searchResultDialogBox, setSearchResultDialogBox, searchResults }: SearchResultDialogBoxProps) {
    const dialogBoxRef = useRef<HTMLDivElement>(null);

    // Handle click outside the dialog box
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(event.target as Node)) {
                setSearchResultDialogBox(false);
            }
        }

        if (searchResultDialogBox) {
            // Add event listener to detect clicks outside
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            // Clean up event listener on component unmount
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchResultDialogBox, setSearchResultDialogBox]);

    return (
        <div
            ref={dialogBoxRef}
            className={`absolute cursor-pointer right-24 mt-2 w-[300px] font-light bg-white dark:bg-[#262629] dark:text-gray-200 rounded-[4px] shadow-lg ring-1 ring-black ring-opacity-5 ${searchResults.length > 0 && "overflow-y-auto max-h-60"} ${!searchResultDialogBox ? "hidden" : ""}`}
        >
            <div>
                {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div
                            onClick={() => {
                                window.open(`/chat/${result.id}`, '_blank');
                                setSearchResultDialogBox(false);
                            }}
                            key={index}
                            className="hover:bg-gray-100 dark:hover:bg-zinc-700 px-4 py-2.5 text-xs font-thin"
                        >
                            {result.name}
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-2 text-center text-xs font-thin">No results found</div>
                )}
            </div>
        </div>
    );
}
