import { RedBtn } from "../buttons/RedBtn";
import { signOut } from "next-auth/react";
import BigWhiteBtn from "../buttons/BigWhiteBtn";
import CrossButton from "./CrossButton";
import { Dispatch, SetStateAction } from "react";
import UtilityCard from "./UtilityCard";

interface props {
    logoutDropdown: boolean;
    setLogoutDropDown: Dispatch<SetStateAction<boolean>>;
}


export default function ({ setLogoutDropDown }: props) {
    const handleLogout = async () => {
        signOut({
            redirect: true,
            callbackUrl: "/"
        })
    }
    return (
        <div className={`fixed inset-0 bg-opacity-50 bg-black flex items-center justify-center z-50 `}>
            <UtilityCard className="dark:bg-neutral-800 dark:border-neutral-600 border-[1px] max-w-lg p-6 relative">
                <div className="w-[400px]">
                    <div className="flex justify-between">
                    <p className="text-md font-bold mb-4">
                        Log out
                    </p>
                    <CrossButton setOpen={setLogoutDropDown}/>
                    </div>
                    <p className="text-xs font-light mb-4">
                        Are you sure you want to log out? <br/> 
                        You can come back anytime, Press cancel to stay !!
                    </p>
                    <div className="flex items-center justify-end gap-4 pt-4 pr-2 w-full">
                        <BigWhiteBtn onClick={() => setLogoutDropDown(false)}>Cancel</BigWhiteBtn>
                        <RedBtn onClick={handleLogout}>
                            Log out
                        </RedBtn>
                    </div>
                </div>
            </UtilityCard>
        </div>
    )
}