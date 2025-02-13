import { TaskStatus, TaskTypes } from "types"

interface ColumnProps {
    col: {
        status: string,
        tasksInColumn: TaskTypes[]
    }
}

export default function ({ col }: ColumnProps) {
    return (
        <div className=" p-2">
            <h1 className="capitalize dark:text-neutral-200">{col.status}</h1>
            <div className="flex flex-col">
                {/* {
                    col.tasksInColumn && col.tasksInColumn.map((task) => {
                        return <Tas
                    })
                } */}
            </div>
        </div>
    )
}