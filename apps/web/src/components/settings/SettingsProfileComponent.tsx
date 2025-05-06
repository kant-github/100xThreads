import { useRecoilValue } from "recoil";
import Userdata from "./user/UserData";
import UserEventCards from "./UserEventCards";
import { userProfileAtom } from "@/recoil/atoms/users/userProfileAtom";

export default function () {
    const userProfileData = useRecoilValue(userProfileAtom);
    return (
        <div className="w-full py-6 px-8 text-zinc-100">
            <div className="">
                <Userdata userProfileData={userProfileData} />
                <hr className="border-t border-zinc-600 border-0 h-px bg-zinc-500  mt-8" />
                <UserEventCards className={"mt-4"} />
            </div>
        </div>
    )

}