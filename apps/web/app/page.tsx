'use client'
import HeroSection from "@/components/base/HeroSection";
import Navbar from "@/components/base/Navbar";
import WebSocketNotificationClient from "@/lib/socket.notification";
import { useEffect, useState } from "react";

export default function () {
  const [socket, setSocket] = useState<WebSocketNotificationClient | null>(null);

  useEffect(() => {
    console.log("HomePage mounted - initializing WebSocket");

    // Create socket connection only once when component mounts
    const notificationSocket = new WebSocketNotificationClient('ws://localhost:7002/socket');
    setSocket(notificationSocket);

    // Clean up socket when component unmounts
    return () => {
      console.log("HomePage unmounting - closing WebSocket connection");
      // notificationSocket.close();
    };
  }, []);


  return (
    <div>
      <Navbar />
      <HeroSection />
    </div>
  );
}
