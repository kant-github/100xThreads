import { format, differenceInDays } from 'date-fns';

// Define the props interface
interface ProjectTimespanProps {
    project: {
        created_at: string | Date;
        due_date: string | Date;
    }
}

export default function ProjectTimespan({ project }: ProjectTimespanProps) {
    const createdProjectDate = new Date(project.created_at);
    const projectDueDate = new Date(project.due_date);
    const calculatedDifference = differenceInDays(projectDueDate, createdProjectDate);

    return (
        <div className="mt-5 w-full relative">
            {/* Container for the timeline */}
            <div className="flex items-center w-full h-6">
                {/* Start date bubble */}
                <div className="z-10 bg-green-700 px-2 py-0.5 rounded-full border border-green-600 shadow-sm">
                    <span className="text-xs dark:text-light font-light flex items-center justify-center">
                        {format(createdProjectDate, 'd MMM')}
                    </span>
                </div>

                {/* Timeline line */}
                <div className="flex-grow h-0.5 bg-green-600 mx-1"></div>

                {/* Days count bubble */}
                <div className="z-10 bg-green-700 px-2 py-0.5 rounded-full border border-green-600 shadow-sm">
                    <span className="text-xs dark:text-light font-light flex items-center justify-center">
                        {calculatedDifference} days
                    </span>
                </div>

                {/* Timeline line */}
                <div className="flex-grow h-0.5 bg-green-600 mx-1"></div>

                {/* End date bubble */}
                <div className="z-10 bg-green-700 px-2 py-0.5 rounded-full border border-green-600 shadow-sm">
                    <span className="text-xs dark:text-light font-light flex items-center justify-center">
                        {format(projectDueDate, 'd MMM')}
                    </span>
                </div>
            </div>
        </div>
    );
}