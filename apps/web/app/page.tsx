'use client'
import HeroSection from "@/components/base/HeroSection";
import Navbar from "@/components/base/Navbar";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebsocket";

export default function () {

  useNotificationWebSocket();

  return (
    <div>
      <Navbar />
      <HeroSection />
    </div>
  );
}
