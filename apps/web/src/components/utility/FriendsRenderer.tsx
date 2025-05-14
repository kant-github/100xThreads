import { API_URL } from "@/lib/apiAuthRoutes"
import { userSessionAtom } from "@/recoil/atoms/atom"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { UserType } from "types/types"
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading"
import { Option } from "../organization/OrganizationRightDashboard"
import OptionImage from "../ui/OptionImage"
import Image from "next/image"

interface FriendsRendererProps {
    open: boolean;
}

export default function ({ open }: FriendsRendererProps) {
    const [friends, setfriends] = useState<UserType[]>();
    const session = useRecoilValue(userSessionAtom);
    async function getFriends() {
        console.log("making backend call");
        try {
            const { data } = await axios.get(`${API_URL}/friends`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`
                }
            })
            setfriends(data.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (open) {
            getFriends();
        }
    }, [open])

    return (
        <div className="flex flex-col h-full">
            <DashboardComponentHeading className="pt-4 sm:pt-6 pl-4 sm:pl-8" description="All of your friends here">
                Friends
            </DashboardComponentHeading>
            <div className="my-4 px-4 flex-1 h-[80%]">
                {
                    friends?.length && friends.map((friend) => (
                        <div className="hover:bg-neutral-800 rounded-[8px] px-4 py-2 flex items-center justify-start gap-x-4">
                            <Image
                                src={friend.image!}
                                width={32}
                                height={32}
                                alt={"user"}
                                className="rounded-full"
                            />
                            <div className="text-xs text-neutral-200">{friend.name}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}