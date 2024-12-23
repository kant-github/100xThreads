import { userSessionAtom } from "@/recoil/atoms/atom"
import Image from "next/image";
import { useRecoilValue } from "recoil"
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


export default function () {
  const session = useRecoilValue(userSessionAtom);
  return (
    <div className="px-2 py-1.5 bg-zinc-800 rounded-[8px]">
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

          <MdOutlineKeyboardArrowDown size={18} />

      </div>
    </div>
  );
}
