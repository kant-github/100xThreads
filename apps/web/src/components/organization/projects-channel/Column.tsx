import React from 'react';
import { ChannelType, TaskTypes } from "types/types";
import Task from './Task';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
    col: {
        status: string,
        tasksInColumn: TaskTypes[]
    };
    channel: ChannelType
}

const statusDisplayNames: Record<string, string> = {
    'TODO': 'To do',
    'IN_PROGRESS': 'In progress',
    'DONE': 'Done'
};

export default function ({ col, channel }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: col.status
    })
    return (
        <div className="px-2 h-full">
            <h1 className="capitalize dark:text-neutral-200">
                {statusDisplayNames[col.status] || col.status}
            </h1>
            <div className="flex flex-col gap-y-2 mt-2 h-full" ref={setNodeRef}>
                {col.tasksInColumn && col.tasksInColumn.map((task) => (
                    <Task key={task.id} channel={channel} task={task} />
                ))}
            </div>
        </div>
    );
}