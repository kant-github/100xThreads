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
                <div className="w-full flex flex-col justify-between gap-y-4 md:gap-y-6 lg:gap-y-8 items-between px-4 md:px-6 lg:px-10 py-4 border-b-[0.5px] border-zinc-700" key={index}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3 sm:gap-y-0">
                        <div className="flex flex-row items-center gap-x-3 w-full sm:w-auto">
                            <Image 
                                className="rounded-[14px] w-8 h-8 md:w-10 md:h-10" 
                                width={40} 
                                height={40} 
                                src={organization.logo} 
                                alt="logo" 
                            />
                            <div className="flex-col flex-1">
                                <div className="text-sm md:text-md dark:text-zinc-200">{organization.title}</div>
                                <div className="text-xs dark:text-zinc-400 line-clamp-2 sm:line-clamp-1">{organization.description}</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-x-4 w-full sm:w-auto justify-end">
                            <div className="text-xs dark:text-zinc-200 font-semibold border-[0.5px] border-zinc-600 py-1 px-2 md:px-3 rounded-[8px] dark:bg-zinc-800/20 dark:hover:bg-zinc-500/40 truncate max-w-[120px] sm:max-w-none cursor-pointer">
                                {organization.owner}
                            </div>
                            <SlOptions className="border-[0.5px] rounded-[7px] border-zinc-600 dark:text-zinc-300 p-1.5 text-xl md:text-2xl cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-y-3 sm:gap-y-0">
                        <div className="flex flex-row items-center gap-x-4 md:gap-x-6 text-xs flex-wrap">
                            <span>
                                <span className="text-green-500 text-[10px]">{organization.onlineUsers}</span>
                                <span className="text-zinc-500 font-medium"> online users</span>
                            </span>
                            <div className="flex flex-row items-center gap-x-2 text-zinc-300">
                                <MdDateRange />
                                <span>{organization.createdAt}</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-2 md:gap-x-3 text-xs flex-wrap">
                            {organization.tags.map((tag, tagIndex) => (
                                <CompanyTagTicker key={tagIndex}>{tag}</CompanyTagTicker>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}