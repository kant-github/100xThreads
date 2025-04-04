import { ProjectChatTypes } from "types/types";
import { format } from "date-fns";
import { BiUserPlus, BiUserMinus, BiUserVoice } from "react-icons/bi";
import { FaTasks, FaUserTag, FaExchangeAlt, FaProjectDiagram, FaInfo } from "react-icons/fa";

interface ProjectchatActivityLogMessageProps {
    message: ProjectChatTypes
}

export default function ProjectchatActivityLogMessage({ message }: ProjectchatActivityLogMessageProps) {
    switch (message.activity_type) {
        case 'MEMBER_ADDED':
            return <MemberAdded message={message} />
        case 'MEMBER_REMOVED':
            return <MemberRemoved message={message} />
        case 'MEMBER_ROLE_CHANGED':
            return <MemberRoleChanged message={message} />
        case 'TASK_CREATED':
            return <TaskCreated message={message} />
        case 'TASK_ASSIGNED':
            return <TaskAssigned message={message} />
        case 'TASK_STATUS_CHANGED':
            return <TaskStatusChanged message={message} />
        case 'PROJECT_UPDATED':
            return <ProjectUpdated message={message} />
        case 'OTHER':
            return <OtherActivity message={message} />
        default:
            return <OtherActivity message={message} />
    }
}

// Base component for consistent styling across all activity types
function ActivityLogBase({ message, color, icon }: { message: ProjectChatTypes, color: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center w-full py-2 px-4 my-1 rounded-[8px] bg-opacity-10" style={{ backgroundColor: `${color}20` }}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="flex flex-col">
                <div className="text-xs font-light dark:text-neutral-200">{message.message}</div>
                <div className="text-xs text-gray-500">
                    {format(new Date(message.created_at), "MMM d, yyyy · h:mm a")}
                </div>
            </div>
        </div>
    );
}

// Individual activity type components with specific colors and icons
function MemberAdded({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#4CAF50" 
        icon={<BiUserPlus className="text-white" size={18} />} 
    />;
}

function MemberRemoved({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#F44336" 
        icon={<BiUserMinus className="text-white" size={18} />} 
    />;
}

function MemberRoleChanged({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#9C27B0" 
        icon={<BiUserVoice className="text-white" size={18} />} 
    />;
}

function TaskCreated({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#2196F3" 
        icon={<FaTasks className="text-white" size={16} />} 
    />;
}

function TaskAssigned({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#FF9800" 
        icon={<FaUserTag className="text-white" size={16} />} 
    />;
}

function TaskStatusChanged({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#00BCD4" 
        icon={<FaExchangeAlt className="text-white" size={16} />} 
    />;
}

function ProjectUpdated({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#673AB7" 
        icon={<FaProjectDiagram className="text-white" size={16} />} 
    />;
}

function OtherActivity({ message }: ProjectchatActivityLogMessageProps) {
    return <ActivityLogBase 
        message={message} 
        color="#607D8B" 
        icon={<FaInfo className="text-white" size={16} />} 
    />;
}