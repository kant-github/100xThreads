import { handleClickOutside } from "@/lib/handleClickOutside";
import { useEffect, useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { GroupChatUserType } from "types/types";

type Props = {
    user: GroupChatUserType | null;
    className?: string;
};

export default function ({ user}: Props) {
    const [openInfoDialogBox, setOpenInfoDialogBox] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const clickHandler = (event: MouseEvent) => {
            handleClickOutside(event, ref, setOpenInfoDialogBox)
        }

        if (openInfoDialogBox) {
            document.addEventListener('mousedown', clickHandler)
        } else {
            document.removeEventListener('mousedown', clickHandler)
        }

        return () => {
            document.removeEventListener('mousedown', clickHandler)
        }
    }, [openInfoDialogBox])
    return (
            <div
                className={`cursor-pointer  bg-yellow-600`}
            >
                <SlOptionsVertical onClick={() => setOpenInfoDialogBox(prev => !prev)} size={10} className="absolute bottom-2 right-3" />

                {openInfoDialogBox && (  // mark here
                    <div ref={ref} className="absolute bottom-0 -right-40 w-40 bg-zinc-600 px-3 py-2 shadow-lg z-50 rounded-[4px]"> 
                        <div className="text-[10px] font-normal flex items-center justify-center">
                            {
                                user?.user.bio.length === 0 ? "No bio available" : user?.user.bio
                            }
                        </div>
                    </div>
                )}
            </div>
    );
}
