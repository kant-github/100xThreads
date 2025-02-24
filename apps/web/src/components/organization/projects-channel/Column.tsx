import React from 'react';
import { TaskTypes } from "types/types";
import Task from './Task';

interface ColumnProps {
    col: {
        status: string,
        tasksInColumn: TaskTypes[]
    }
}

const statusDisplayNames: Record<string, string> = {
    'TODO': 'To do',
    'IN_PROGRESS': 'In progress',
    'DONE': 'Done'
};

export default function Column({ col }: ColumnProps) {
    return (
        <div className="px-2 h-full">
            <h1 className="capitalize dark:text-neutral-200">
                {statusDisplayNames[col.status] || col.status}
            </h1>
            <div className="flex flex-col gap-y-2 mt-2 h-full">
                {col.tasksInColumn && col.tasksInColumn.map((task) => (
                    <Task task={task} />
                ))}
            </div>
        </div>
    );
}