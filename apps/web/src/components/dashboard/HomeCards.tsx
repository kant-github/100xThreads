import { cn } from "@/lib/utils";
import {
  IconArchive,
  IconBell,
  IconCalendarEvent,
  IconChartBar,
  IconMessageCircle,
  IconPhoto,
  IconShieldLock,
  IconUserCheck,
} from "@tabler/icons-react";

export default function ({ className }: { className?: string }) {
  const features = [
    {
      title: "Real-Time Messaging",
      description:
        "Instant communication with live updates for seamless conversations.",
      icon: <IconMessageCircle style={{ color: "#FF5733" }} />, // Bright Orange
    },
    {
      title: "Secure Authentication",
      description:
        "Robust and secure login powered by NextAuth.js with credentials-based authentication.",
      icon: <IconShieldLock style={{ color: "#2ECC71" }} />, // Green
    },
    {
      title: "Media Sharing",
      description:
        "Share images, videos, voice notes, GIFs, and stickers to enhance your chats.",
      icon: <IconPhoto style={{ color: "#3498DB" }} />, // Blue
    },
    {
      title: "User Presence Indicators",
      description:
        "See who's online, typing, or away in real-time to stay connected.",
      icon: <IconUserCheck style={{ color: "#F1C40F" }} />, // Yellow
    },
    {
      title: "Chat History",
      description:
        "Access past conversations anytime with our persistent message storage.",
      icon: <IconArchive style={{ color: "#9B59B6" }} />, // Purple
    },
    {
      title: "Polls and Surveys",
      description:
        "Create and share polls to gather opinions or plan group activities.",
      icon: <IconChartBar style={{ color: "#E74C3C" }} />, // Red
    },
    {
      title: "Event Scheduling",
      description:
        "Organvents with group chats, announcements, and Google Calendar integration.",
      icon: <IconCalendarEvent style={{ color: "#1ABC9C" }} />, // Teal
    },
    {
      title: "Custome Notifications",
      description:
        "Stay in the loop with tailored notifications for new messages and updates.",
      icon: <IconBell style={{ color: "#E67E22" }} />, // Vibrant Orange
    },
  ];


  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative py-8 max-w-7xl mx-auto ${className}`}>
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 mt-2 relative px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold relative px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-xs py-2 text-neutral-600 dark:text-neutral-300 max-w-xs relative px-10">
        {description}
      </p>
    </div>
  );
};
