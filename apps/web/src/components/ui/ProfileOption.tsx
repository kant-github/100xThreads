import { userSessionAtom } from "@/recoil/atoms/atom"
import Image from "next/image";
import { useRecoilValue } from "recoil"

export default function () {
    const session = useRecoilValue(userSessionAtom);
    return (
      <div className="flex items-center gap-x-4 justify-start px-2 py-2 bg-zinc-800 rounded-[8px]">
        <span className="relative">
          {/* Parent span needs to be relative for absolute positioning */}
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
    );
  }
  