"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FRONTEND_BASE_URL } from "@/lib/apiAuthRoutes";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { IoIosCopy } from "react-icons/io";
import { toast } from "sonner";
import { OrganizationType } from "types";
import GroupImage from "./GroupImage";


interface CardHoverChatCardsProps {
  organizations: OrganizationType[];
  className?: string
}

export default function ({ organizations, className }: CardHoverChatCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrganizationType | null>(null);
  const [deleteDialogBox, setDeleteDialogBox] = useState<boolean>(false);
  const [editDialogBox, setEditDialogBox] = useState<boolean>(false);
  const router = useRouter();


  return (
    <>
      <div className={cn("flex flex-wrap gap-x-8 justify-center", className)}>

        {organizations.map((orgs, idx) => (
          <div
            onDoubleClick={() => {
              router.push(`${FRONTEND_BASE_URL}/organizations/${orgs.id}`);
            }}
            key={orgs.id}
            className="relative group block p-2 h-full w-1/4 select-none"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-[#c9d0d4] dark:bg-zinc-700 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <div className="flex justify-between items-start">
                <CardTitle>{orgs.name}</CardTitle>
              </div>
              <CardDate>{orgs.created_at}</CardDate>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl h-32 w-full bg-[#1f282e] dark:bg-[#1c1c1c] border border-transparent dark:border-white/[0.2] relative z-20",
        "w-full md:w-4/5 lg:w-full",
        "sm:px-2 md:px-4 lg:px-6",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4 sm:p-2 md:p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}

function CardTitle({
  className,
  children,
  groupImage,
}: {
  className?: string;
  children: React.ReactNode;
  groupImage?: string;
}) {
  const title = typeof children === "string" ? children : String(children);
  const truncatedTitle = title.slice(0, 16);
  return (
    <div className="flex flex-row gap-x-4 items-center">
      {/* {groupImage && (
        <Image
          src={groupImage}
          width={32}
          height={32}
          alt="logo"
          className="rounded-[20px]"
        />
      )} */}
      <GroupImage groupImage={groupImage!} groupTitle={title} />
      <h4 className={cn("text-zinc-100  font-bold tracking-wide", className)}>
        {truncatedTitle}
      </h4>
    </div>
  );
}

function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [showPasscode, setShowPasscode] = useState(false);

  const togglePasscodeVisibility = () => {
    setShowPasscode((prev) => !prev);
  };

  async function handleCopy() {
    const passcodeText: string =
      typeof children === "string" ? children : String(children);

    try {
      await navigator.clipboard.writeText(passcodeText);
      toast.success("Passcode copied to clipboard");
    } catch (err) {
      toast.error("Error in copying passcode");
    }
  }

  return (
    <div
      className={cn(
        "mt-6 text-zinc-100 font-light flex tracking-wide leading-relaxed text-xs",
        className
      )}
    >
      <p>Passcode:</p>
      <i className="font-thin ml-1">{showPasscode ? children : "••••••••"}</i>
      <button type="button" onClick={togglePasscodeVisibility} className="ml-2">
        {showPasscode ? <IoEyeOff /> : <IoEye />}
      </button>
      <button
        aria-label="button"
        type="button"
        className="ml-2"
        onClick={handleCopy}
      >
        <IoIosCopy />
      </button>
    </div>
  );
}

function CardDate({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-2 text-zinc-100 flex tracking-wide leading-relaxed text-xs",
        className
      )}
    >
      <p className="font-light">Created at :</p>
      <i className="ml-1 text-[10px] font-light">{children}</i>
    </div>
  );
}
