"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { OrganizationType, UserType } from "types/types";
import OptionImage from "../ui/OptionImage";

interface SearchResultDialogBoxProps {
    searchResultDialogBox: boolean;
    setSearchResultDialogBox: Dispatch<SetStateAction<boolean>>;
    usersList: UserType[];
    organizationsList: OrganizationType[]
}


export default function SearchResultDialogBox({ searchResultDialogBox, setSearchResultDialogBox, usersList, organizationsList }: SearchResultDialogBoxProps) {
    const dialogBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(event.target as Node)) {
                setSearchResultDialogBox(false);
            }
        }

        if (searchResultDialogBox) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchResultDialogBox, setSearchResultDialogBox]);

    return (
        <div
            ref={dialogBoxRef}
            className={`absolute z-10 cursor-pointer right-24 mt-2 w-[300px] font-light bg-white dark:bg-neutral-800 dark:text-gray-200 rounded-[4px] shadow-lg ring-1 ring-black ring-opacity-5 ${usersList.length > 0 && "overflow-y-auto max-h-60"} ${!searchResultDialogBox ? "hidden" : ""}`}
        >

            {
                organizationsList.length > 0 && (
                    <div>
                        <span className="text-xs font-light ml-4">organizations</span>
                        {
                            organizationsList.map((organization, index) => (
                                <div
                                    onClick={() => {
                                        setSearchResultDialogBox(false);
                                        window.open(`/org/${organization.id}`, '_blank');

                                    }}
                                    key={index}
                                    className="hover:bg-gray-100 dark:hover:bg-yellow-600/30 px-4 py-2 text-xs font-thin flex items-center justify-start gap-x-3"
                                >
                                    {
                                        organization.image && (
                                            <Image
                                                src={organization.image!}
                                                width={28}
                                                height={28}
                                                alt="user"
                                                className="rounded-full"
                                            />
                                        )
                                    }
                                    {organization.name}
                                </div>
                            ))
                        }
                    </div>
                )
            }

            {
                usersList.length > 0 && (
                    <div>
                        <span className="text-xs font-light ml-4">users</span>
                        {
                            usersList.map((user, index) => (
                                <OptionImage
                                    content={
                                        <div
                                            onClick={() => {
                                                // setSearchResultDialogBox(false);
                                            }}
                                            key={index}
                                            className="hover:bg-gray-100 dark:hover:bg-yellow-600/30 px-4 py-2 text-xs font-thin flex items-center justify-start gap-x-3"
                                        >
                                            <Image
                                                src={user.image!}
                                                width={28}
                                                height={28}
                                                alt="user"
                                                className="rounded-full"
                                            />
                                            {user.name}
                                        </div>
                                    }
                                    userId={user.id}
                                />
                            ))
                        }
                    </div>
                )
            }

        </div>
    );
}
