import { TaskTypes } from "types"
import Column from "./Column";

interface KanBanBoardProps {
    tasks: TaskTypes[] | [];
}

const statuses = ['TODO', 'IN_PROGRESS', 'DONE']

export default function ({ tasks }: KanBanBoardProps) {

    const column = statuses.map((status) => {
        const tasksInColumn = tasks.filter(task => task.status === status);
        return {
            status,
            tasksInColumn
        }
    })

    console.log("columns are : ", column);

    return (
        <div className="w-full h-full grid grid-flow-col gap-x-2">
            {
                column.map((col) => (
                    <Column col={col} />
                ))
            }
        </div>
    )
}