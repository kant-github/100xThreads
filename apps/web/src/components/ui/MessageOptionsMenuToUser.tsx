import { LuPencilLine } from "react-icons/lu";
import { IoIosCopy } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { MessageType } from "types/types";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { AiFillLike } from "react-icons/ai";
import { IoHeartDislikeSharp } from "react-icons/io5";

interface MessageOptionsMenuProps {
  msg: MessageType;
  color?: string;
  isOpen: boolean;
  like: boolean;
  setLike: Dispatch<SetStateAction<boolean>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  likeHandler: () => void
}

export default function ({
  msg,
  like,
  setLike,
  isOpen,
  setIsOpen,
  likeHandler
}: MessageOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [positionAbove, setPositionAbove] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect && window.innerHeight - rect.bottom < 200) {
        setPositionAbove(true);
      } else {
        setPositionAbove(false);
      }
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <div className="absolute bottom-1">
        <PiDotsThreeVerticalBold
          size={12}
          className="cursor-pointer dark:text-zinc-100 text-zinc-100"
          onClick={toggleMenu}
          color="black"
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: positionAbove ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: positionAbove ? 10 : -10 }}
            className={`absolute rounded-[4px] left-0 w-24 bg-white dark:bg-zinc-700 shadow-lg z-50 ${positionAbove ? "bottom-full mb-2" : "top-full mt-2"
              }`}
          >
            <div className="py-0.5 text-[11px] text-zinc-900 dark:text-zinc-100">
              <div
                onClick={() => {
                  setLike((prev) => {
                    const newLikeState = !prev; // Calculate the new state
                    likeHandler(); // Handle side effects, if any
                    return newLikeState;
                  });
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-4 py-1 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-[#262629] cursor-pointer text-[11px]"
              >
                <span>{like ? "Unlike" : "Like"}</span>
                <span>{like ? <IoHeartDislikeSharp /> : <AiFillLike />}</span>
              </div>


              <div
                onClick={() => { }}
                className="flex items-center justify-between px-4 py-1 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-[#262629] cursor-pointer text-[11px]"
              >
                <span>Edit</span>
                <LuPencilLine />
              </div>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(msg.message!);
                  toast.success("Message copied to clipboard");
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-4 py-1 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-[#262629] cursor-pointer text-[11px]"
              >
                <span>Copy</span>
                <IoIosCopy />
              </div>
              <div
                onClick={() => { }}
                className="px-4 py-1 hover:bg-red-200 dark:hover:bg-red-600 dark:bg-red-700 cursor-pointer text-[11px] bg-red-50 flex flex-row items-center justify-between"
              >
                Delete
                <MdDelete
                  className="text-red-500 dark:text-red-200"
                  size={14}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
