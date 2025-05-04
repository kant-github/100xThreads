import { NotificationType } from "types/types";
import clsx from "clsx";

export default function NotificationTitle({
  type,
  title,
}: {
  type: NotificationType["type"];
  title: string;
}) {
  const typeColorMap: Record<NotificationType["type"], string> = {
    FRIEND_REQUEST_RECEIVED: "text-pink-400/80",
    FRIEND_REQUEST_ACCEPTED: "text-green-500/80",
    FRIEND_REQUEST_REJECTED: "text-red-500",
    FRIEND_ONLINE: "text-green-400",
    FRIEND_MESSAGE_RECEIVED: "text-blue-400",
    ORG_INVITE_RECEIVED: "text-yellow-500",
    ORG_JOIN_REQUEST_RESPONSE: "text-indigo-400",
    ORG_ROLE_CHANGED: "text-purple-400",
    ORG_JOIN_REQUEST_RECEIVED: "text-yellow-500",
    NEW_CHANNEL_MESSAGE: "text-sky-400",
    CHANNEL_MENTION: "text-rose-400",
    NEW_ANNOUNCEMENT: "text-orange-500/80",
    ANNOUNCEMENT_REQUIRING_ACK: "text-orange-600",
    EVENT_CREATED: "text-violet-400",
    EVENT_REMINDER: "text-violet-500",
    EVENT_UPDATED: "text-violet-300",
    EVENT_CANCELLED: "text-red-500",
    PROJECT_ADDED: "text-emerald-400",
    TASK_ASSIGNED: "text-lime-500",
    TASK_DUE_SOON: "text-amber-500",
    TASK_STATUS_CHANGED: "text-cyan-500",
    NEW_POLL: "text-indigo-300",
    POLL_ENDING_SOON: "text-indigo-500",
    POLL_RESULTS: "text-indigo-400",
    ISSUE_ASSIGNED: "text-teal-500",
    ISSUE_STATUS_CHANGED: "text-teal-300",
    CHAT_REACTION: "text-pink-400",
    LIKED_MESSAGE: "text-pink-500",
  };

  const color = typeColorMap[type] || "text-neutral-500";

  return <p className={clsx("text-xs font-normal", color)}>{title}</p>;
}
