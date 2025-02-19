import { ProjectTypes } from "types/types";
import { format, differenceInDays } from 'date-fns';

interface ProjectTimespanProps {
    project: ProjectTypes
}

export default function ({ project }: ProjectTimespanProps) {
    const createdProjectDate = new Date(project.created_at);
    const projectDueDate = new Date(project.due_date);

    const claculatedDifference = differenceInDays(projectDueDate, createdProjectDate);

    return (
        <div className="mt-5 w-full relative">
            <hr className="border-t-1 border-green-600" />
            <div className="absolute -top-2 left-0 right-0 text-green-600 flex justify-between items-center">
                <span className="text-[11px] bg-white dark:bg-neutral-800 group-hover:dark:bg-[#242424] pr-2">
                    {format(createdProjectDate, 'd MMM')}
                </span>
                <span className="text-[11px] bg-white dark:bg-neutral-800 group-hover:dark:bg-[#242424] px-2 font-semibold italic">
                    {claculatedDifference} days
                </span>
                <span className="text-[11px] bg-white dark:bg-neutral-800 group-hover:dark:bg-[#242424] pl-2">
                    {format(projectDueDate, 'd MMM')}
                </span>
            </div>
        </div>
    );
};