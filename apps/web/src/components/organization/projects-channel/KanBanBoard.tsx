import React from 'react';
import { TaskTypes } from "types/types"
import Column from "./Column";

interface KanBanBoardProps {
    tasks: TaskTypes[] | [];
}

const statuses = ['TODO', 'IN_PROGRESS', 'DONE']

export default function KanbanBoard({ tasks }: KanBanBoardProps) {
    const column = statuses.map((status) => {
        const tasksInColumn = tasks.filter(task => task.status === status);
        
        return {
            status,
            tasksInColumn
        }
    })
    
    return (
        <div className="w-full h-full overflow-y-auto scrollbar-hide flex-1 flex">
            {column.map((col, index) => (
                <React.Fragment key={col.status}>
                    <div className="flex-1 min-w-0">
                        <Column col={col} />
                    </div>
                    {index < column.length - 1 && (
                        <div className="w-px bg-neutral-700 h-full sticky top-0" />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}