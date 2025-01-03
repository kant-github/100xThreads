import Image from "next/image";
import { MdDateRange } from "react-icons/md";
import CompanyTagTicker from "../utility/CompanyTagTicker";
import { SlOptions } from "react-icons/sl";

interface ListTypeOrganizations {
    organizations: Organization[] | [];
}

interface Organization {
    title: string;
    description: string;
    tags: string[];
    logo: string;
    totalUsers: number;
    onlineUsers: number;
    owner: string;
    createdAt: string;
}

export default function ({ organizations }: ListTypeOrganizations) {
    return (
        <div className="flex flex-col overflow-y-auto scrollbar-hide h-[70vh]">
            {organizations.map((organization, index) => (
                <div className="w-full flex flex-col justify-between gap-y-8 items-between px-10 py-4 border-b-[0.5px] border-zinc-700" key={index}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-x-3">
                            <Image className="rounded-[14px]" width={40} height={40} src={organization.logo} alt="logo" />
                            <div className="flex-col">
                                <div className="text-md dark:text-zinc-200">{organization.title}</div>
                                <div className="text-xs dark:text-zinc-400">{organization.description}</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-x-4">
                            <div className="text-xs dark:text-zinc-200 font-semibold border-[0.5px] border-zinc-600 py-1 px-3 rounded-[8px] dark:bg-zinc-800/20">{organization.owner}</div>
                            <SlOptions className="border-[0.5px] rounded-[7px] border-zinc-600 dark:text-zinc-300 p-1.5 text-2xl" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row items-center gap-x-6 text-xs">
                            <span>
                                <span className="text-green-500 text-xs">{organization.onlineUsers}</span>
                                <span className="text-zinc-500 font-medium"> online users</span>
                            </span>
                            <div className="flex flex-row items-center gap-x-2 text-zinc-300">
                                <MdDateRange />
                                <span>{organization.createdAt}</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-3 text-xs">
                            {organization.tags.map((tag, tagIndex) => (
                                <CompanyTagTicker>{tag}</CompanyTagTicker>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}