import Image from "next/image";
import { MdDateRange } from "react-icons/md";
import CompanyTagTicker from "../utility/CompanyTagTicker";
import { SlOptions } from "react-icons/sl";
import { OrganizationType } from "types/types";
import Link from "next/link";
import { format } from 'date-fns'

interface ListTypeOrganizations {
    organizations: OrganizationType[] | [];
}


export default function ({ organizations }: ListTypeOrganizations) {
    console.log(organizations);
    return (
        <div className="flex flex-col overflow-y-auto scrollbar-hide max-h-[70vh]">
            {organizations.map((organization, index) => {
                const date = organization.created_at ? format(new Date(organization.created_at), 'MMMM dd, yyyy') : null;
                return (
                    <Link href={`/org/${organization.id}`}
                        className="w-full flex flex-col justify-between gap-y-4 md:gap-y-6 lg:gap-y-8 items-between px-4 md:px-6 lg:px-12 py-4 border-b-[0.5px] border-zinc-700 h-36 dark:bg-neutral-800 hover:dark:bg-neutral-700/10" key={index}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3 sm:gap-y-0">
                            <div className="flex flex-row items-center gap-x-3 w-full sm:w-auto">
                                <Image
                                    className="rounded-[14px] w-8 h-8 md:w-12 md:h-12"
                                    width={50}
                                    height={40}
                                    src={"/images/amazonlogo.png"}
                                    alt="logo"
                                />
                                <div className="flex-col flex-1">
                                    <div className="text-md font-bold md:text-lg dark:text-neutral-50">{organization.name}</div>
                                    <div className="text-[13px] dark:text-zinc-50 line-clamp-2 sm:line-clamp-1">{organization.description}</div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-x-4 w-full sm:w-auto justify-end">
                                <div className="text-xs dark:text-zinc-200 font-semibold border-[0.5px] border-zinc-600 py-1 px-2 md:px-3 rounded-[8px] dark:bg-zinc-800/20 dark:hover:bg-zinc-500/40 truncate max-w-[120px] sm:max-w-none cursor-pointer">
                                    {organization.owner.name}
                                </div>
                                <SlOptions className="border-[0.5px] rounded-[7px] border-zinc-600 dark:text-zinc-300 p-1.5 text-xl md:text-2xl cursor-pointer dark:bg-zinc-800/20 dark:hover:bg-zinc-500/40 " />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-y-3 sm:gap-y-0">
                            <div className="flex flex-row items-center gap-x-4 md:gap-x-6 text-xs flex-wrap">
                                <span className="text-[13px]">
                                    <span className="text-green-500">{"10"} online</span>
                                    {/* <span className="text-zinc-500 font-medium"> online</span> */}
                                </span>
                                <div className="flex flex-row items-center gap-x-2 text-zinc-300 text-[13px]">
                                    <MdDateRange />
                                    <span>created on : {date}</span>
                                </div>
                            </div>
                            <div className="flex flex-row gap-x-2 md:gap-x-3 text-xs flex-wrap">
                                {organization.tags.map((tag, tagIndex) => (
                                    <CompanyTagTicker color={organization.organizationColor} key={tagIndex}>{tag}</CompanyTagTicker>
                                ))}
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}