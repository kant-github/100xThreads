import React, { useEffect } from 'react';
import { ChannelType, TaskTypes } from "types/types"
import Column from "./Column";
import { useWebSocket } from '@/hooks/useWebsocket';
import { useRecoilValue } from 'recoil';
import { organizationIdAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';

interface KanBanBoardProps {
    tasks: TaskTypes[] | [];
    channel: ChannelType
}

const statuses = ['TODO', 'IN_PROGRESS', 'DONE']

export default function KanbanBoard({ tasks, channel }: KanBanBoardProps) {
    const organizationId = useRecoilValue(organizationIdAtom);

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
                        <Column channel={channel} col={col} />
                    </div>
                    {index < column.length - 1 && (
                        <div className="w-px bg-neutral-700 h-full sticky top-0" />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}