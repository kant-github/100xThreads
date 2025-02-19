import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom"
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationUsersType, UserType } from "types/types"
import ProfileOption from "../ui/ProfileOption";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import AppLogo from "../heading/AppLogo";

const baseDivStyles = "flex items-center justify-start gap-x-2 sm:gap-x-3 py-1.5 sm:py-1.5 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[12px] text-gray-100 dark:text-[#d6d6d6] font-semibold mt-0.5 tracking-wide hidden sm:block";

export default function () {
    const [organizationUsers, setOrganizationUsers] = useRecoilState<OrganizationUsersType[]>(organizationUsersAtom);
    return (
        <div className="w-[30%] px-4 pt-4 bg-white dark:bg-[#171717] border-b-[1px] md:border-b-0 md:border-l-[1px] dark:border-zinc-800 flex flex-col justify-between">
            <div>
                <ProfileOption />
                <div className="flex flex-row sm:flex-col justify-around sm:justify-start sm:mt-3 gap-x-1 py-1 rounded-[14px] bg-neutral-800">
                    {
                        organizationUsers.map((user) => (
                            <Option key={user.id} user={user.user} />
                        ))
                    }
                </div>
            </div>
            <div className="mt-2 bottom-4 absolute  mx-2 dark:text-neutral-200">
                <AppLogo />
                <p className="text-[11px] font-thin mx-3 my-2 mb-4 italic">
                    100xThreads is the go-to solution for managing group chats and rooms.
                </p>
            </div>
        </div>
    )
}

function Option({ isSelected, onClick, user }: {
    isSelected?: boolean;
    onClick?: () => void;
    user: UserType;
}) {
    const organization = useRecoilValue(organizationAtom);
    return (
        <div onClick={onClick} style={{ ['--hover-color' as string]: `${organization?.organizationColor}66` }}
            className={`${baseDivStyles} ${isSelected
                ? "bg-zinc-700 text-white"
                : "transition-colors duration-200"
                } hover:[background-color:var(--hover-color)]`} >
            <span className="relative">
                <span className="bg-green-500 absolute bottom-1 right-1 transform translate-x-1/4 translate-y-1/4 rounded-full border-2 border-zinc-800 z-20 h-2.5 w-2.5"></span>
                <Image
                    src={user?.image!}
                    alt="user-image"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </span>
            <span className={`${textStyles}`}>{user.name}</span>
        </div>
    );
}