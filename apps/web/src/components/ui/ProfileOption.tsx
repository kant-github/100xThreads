import { userSessionAtom } from "@/recoil/atoms/atom"
import Image from "next/image";
import { useRecoilValue, useSetRecoilState } from "recoil"
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useRef, useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { TiUser } from "react-icons/ti";
import LogOutDialogBox from "../utility/LogOutDialogBox";
import { settingsOptionAtom, settingsOptionEnum } from "@/recoil/atoms/SettingsOptionAtom";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";

export default function () {
  const [open, setOpen] = useState<boolean>(false);
  const [logoutDropdown, setLogoutDropdown] = useState<boolean>(false);
  const setSettingsAtom = useSetRecoilState(settingsOptionAtom);
  const setDashboardAtom = useSetRecoilState(dashboardOptionsAtom);
  const session = useRecoilValue(userSessionAtom);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className="px-2 py-1 dark:bg-neutral-800 bg-secondLight rounded-[8px] cursor-pointer select-none">
      <div onClick={() => setOpen(prev => !prev)} className="flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          <span className="relative">
            <span className="bg-green-500 absolute bottom-1 right-1 transform translate-x-1/4 translate-y-1/4 rounded-full border-2 border-zinc-800 z-20 h-2.5 w-2.5"></span>
            <Image src={session.user?.image!} alt="user-image" width={32} height={32} className="rounded-full" />
          </span>
          <span className="text-[13px] dark:text-darkText text-lightText font-normal mt-0.5 tracking-wide">
            {session.user?.name}
          </span>
        </div>
        <span className="cursor p-1">
          <MdOutlineKeyboardArrowDown
            className={`text-lightText dark:text-darkText transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
            size={18}
          />
        </span>
      </div>

      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${open ? 'max-h-[100px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col">
          <div
            onClick={() => {
              setDashboardAtom(RendererOption.Settings);
              setSettingsAtom(settingsOptionEnum.Profile)
            }}
            className="flex gap-x-3 py-2 px-3 rounded-[8px] cursor-pointer dark:hover:bg-neutral-700 hover:bg-secondLight text-[13px] text-lightText dark:text-darkText font-normal mt-0.5 tracking-wide select-none transition-colors duration-200"
          >
            <TiUser size={18} />
            <span>Profile</span>
          </div>
          <div
            onClick={() => setLogoutDropdown(true)}
            className="flex gap-x-3 py-2 px-3 rounded-[8px] cursor-pointer hover:bg-red-600 text-[13px] dark:text-darkText text-lightText font-normal mt-0.5 tracking-wide select-none transition-colors duration-200"
          >
            <PiSignOut size={18} />
            <span>Sign Out</span>
          </div>
        </div>
      </div>

      {logoutDropdown &&
        <LogOutDialogBox
          logoutDropdown={logoutDropdown}
          setLogoutDropDown={setLogoutDropdown}
        />
      }
    </div>
  );
}