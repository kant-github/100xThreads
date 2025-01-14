import { GroupChatUserType } from "types";
import { format, differenceInMinutes, differenceInHours } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { HiBars4 } from "react-icons/hi2";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import ChatSideBarUserInfo from "../ui/ChatSideBarUserInfo";

interface Props {
  users: Array<GroupChatUserType> | [];
  onlineUsersList: number[];
}

export default function ChatSidebar({
  users,
  onlineUsersList
}: Props) {
  const participantLabel = users.length === 1 ? "participant" : "participants";
  const [hidden, setHidden] = useState(false);

  function hiddenSidebarHandler() {
    setHidden((prev) => !prev);
  }

  return (
    <div
      className={`transition-all duration-150 ease-in ${hidden ? "w-24" : "w-1/5"} bg-[#f2f2f2] dark:bg-[#1c1c1c] dark:text-gray-300 h-[91.5vh] flex flex-col pb-[12px] relative`}
    >
      <span className="flex justify-end mt-4">
        <span className="border-[1px] border-zinc-600 p-1 rounded-[4px]">
          {hidden ? (
            <MdOutlineKeyboardArrowRight
              onClick={hiddenSidebarHandler}
              className="cursor-pointer dark:text-zinc-400 text-zinc-600"
              size={18}
            />
          ) : (
            <HiBars4
              onClick={hiddenSidebarHandler}
              className="cursor-pointer dark:text-zinc-400 text-zinc-600"
              size={18}
            />
          )}
        </span>
      </span>

      <div>
        <div className={`text-[10px] font-mono ml-9 ${hidden ? "mt-10" : "mt-[1rem]"}`}>
          {!hidden && <>{users.length} {participantLabel}</>}
        </div>
        <div className="pl-6 flex-grow overflow-y-auto overflow-x-clip scrollbar-hide space-y-4 mt-2 h-[80vh]">
          {users.length > 0 &&
            users.map((item, index) => {
              const joinedAt = new Date(item.joined_at);
              const now = new Date();
              const hoursDifference = differenceInHours(now, joinedAt);
              let joinTimeDisplay;

              if (hoursDifference < 24) {
                const minutesDifference = differenceInMinutes(now, joinedAt);
                joinTimeDisplay =
                  minutesDifference < 60
                    ? `${minutesDifference} minutes ago`
                    : `${hoursDifference} hours ago`;
              } else {
                joinTimeDisplay = format(joinedAt, "MMMM dd, yyyy");
              }

              const isOnline = onlineUsersList.includes(item.user.id);
              return (
                <div
                  key={index}
                  className={`flex flex-row items-center justify-center gap-x-3 border-[1px] dark:border-gray-600 text-[10px] ${hidden ? "h-[64px]" : "h-[70px] pr-4 pl-2"} bg-white rounded-[8px] transition-shadow dark:hover:shadow-lg hover:shadow-md dark:bg-[#262629] relative`}
                >
                  {!hidden && <ChatSideBarUserInfo user={item} />}

                  {!hidden && (
                    <div
                      className={`${
                        isOnline
                          ? "bg-green-500 animate-pulse glow-effect"
                          : "bg-red-500 animate-pulse red-glow-effect"
                      } text-white rounded-full px-[2.5px] py-[2.5px] absolute right-4 top-3`}
                    ></div>
                  )}

                  {!hidden ? (
                    <Image
                      width={34}
                      height={34}
                      alt="logo"
                      src={item.user.image}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="relative">
                      <Image
                        width={34}
                        height={34}
                        alt="logo"
                        src={item.user.image}
                        className="rounded-full"
                      />
                      <div
                        className={`${
                          isOnline ? "bg-green-500" : "bg-red-500"
                        } text-white rounded-full px-[3px] py-[3px] absolute -right-[3px] top-3 border-4 border-[#262629]`}
                      ></div>
                    </span>
                  )}

                  {!hidden && (
                    <div className="flex flex-col w-full py-2 gap-y-0.5">
                      <h2 className="text-[12px] font-semibold">
                        {item.user.name.slice(0, 12)}
                      </h2>
                      <p className="text-[11px]">
                        Joined: <i className="font-thin">{joinTimeDisplay}</i>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}