import { userSessionAtom } from "@/recoil/atoms/atom"
import Image from "next/image";
import { useRecoilValue } from "recoil"
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { TiUser } from "react-icons/ti";
import { handleClickOutside } from "@/lib/handleClickOutside";
import LogOutDialogBox from "../utility/LogOutDialogBox";


export default function () {
  const [open, setOpen] = useState<boolean>(false);
  const [logoutDropdown, setLogoutDropdown] = useState<boolean>(false);
  const session = useRecoilValue(userSessionAtom);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      handleClickOutside(event, ref, setOpen);
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    }
  }, [open, setOpen]);

  return (
    <div ref={ref} className={`px-2 py-1.5 bg-zinc-800 rounded-[8px] cursor-pointer`} onClick={() => setOpen(prev => !prev)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          <span className="relative">
            <span className="bg-green-500 absolute bottom-1 right-1 transform translate-x-1/4 translate-y-1/4 rounded-full border-2 border-zinc-800 z-20 h-2.5 w-2.5"></span>
            <Image
              src={session.user?.image!}
              alt="user-image"
              width={32}
              height={32}
              className="rounded-full"
            />
          </span>
          <span className="text-sm text-zinc-100 font-normal mt-0.5 tracking-wide">
            {session.user?.name}
          </span>
        </div>
        <span className="cursor p-1">
          <MdOutlineKeyboardArrowDown size={18} />
        </span>
      </div>
      {
        open && (
          <div className="flex flex-col mt-2">

            <div className="flex gap-x-3 py-2 px-3 rounded-[8px] cursor-pointer hover:bg-zinc-700 text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide select-none">
              <TiUser size={18} />
              <span>Profile</span>
            </div>

            <div onClick={() => setLogoutDropdown(true)} className="flex gap-x-3 py-2 px-3 rounded-[8px] cursor-pointer hover:bg-red-600 text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide select-none">
              <PiSignOut size={18} />
              <span>Sign Out</span>
            </div>

          </div>
        )
      }
      {
        logoutDropdown && <LogOutDialogBox logoutDropdown={logoutDropdown} setLogoutDropDown={setLogoutDropdown} />
      }
    </div>
  );
}