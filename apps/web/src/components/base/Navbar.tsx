"use client";
import BlackBtn from "../buttons/BlackBtn";
import { useState } from "react";
import LoginModal from "./LoginModal";
import { useSession } from "next-auth/react";
import AppLogo from "../heading/AppLogo";
import { useRouter } from "next/navigation";
import { WhiteBtn } from "../buttons/WhiteBtn";
import Version from "../buttons/Version";

export default function () {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleGettingStartedClick = () => {
    setIsModalOpen(true);
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      <div className="flex justify-between w-full px-16 py-4 bg-white dark:bg-black border-b dark:border-zinc-700 dark:shadow-[40px]">
        <div className="flex items-center gap-x-2">
          <AppLogo />
          <Version />
        </div>
        <div className="flex items-center gap-x-12">
          <div className="flex flex-row items-center justify-center gap-x-6">
            {
              session?.user ? (
                <WhiteBtn className="z-[100]" onClick={handleDashboardClick}>Dashboard</WhiteBtn>
              ) : (
                <WhiteBtn className="z-[100]" onClick={handleGettingStartedClick}>Getting Started</WhiteBtn>
              )
            }
          </div>
        </div>
      </div>
      <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
