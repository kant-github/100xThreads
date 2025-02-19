import { useState } from 'react';
import { Clock, Flag } from 'lucide-react';
import { TaskTypes } from 'types/types';
import Image from 'next/image';

type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';


interface KanbanTaskCardProps {
  task: TaskTypes;
  onStatusChange?: (taskId: string, newStatus: CardStatus) => void;
}

export default function KanbanTaskCard({ task, onStatusChange }: KanbanTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow">
      {/* Title */}
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          <Flag className="w-3 h-3 inline mr-1" />
          {task.priority.toLowerCase()}
        </span>
      </div>

      {/* Description - Expandable */}
      {task.description && (
        <div
          className={`mt-2 text-sm text-gray-600 dark:text-gray-400 ${!isExpanded ? 'line-clamp-2' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {task.description}
        </div>
      )}

      {/* Due Date */}
      {task.due_date && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(task.due_date).toLocaleDateString()}
        </div>
      )}

      {/* Assignees */}
      {task.assignees?.length! > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees?.map((assignees) => (
              <div
                key={assignees.id}
                className="relative"
              >
                {assignees.organization_user.user.image ? (
                  <Image
                    width={24}
                    height={24}
                    src={assignees.organization_user.user.image}
                    alt={"user"}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-800"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-neutral-800 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {assignees.organization_user.user.name[0]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task.assignees.length} {task.assignees.length === 1 ? 'assignee' : 'assignees'}
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="mt-3 flex justify-end">
        <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'TODO' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
          {task.status.toLowerCase().replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}