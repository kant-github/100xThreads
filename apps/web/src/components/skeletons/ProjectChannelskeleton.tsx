import UtilityCard from '../utility/UtilityCard';
import ProjectCardskeleton from './ProjectCardskeleton';

export default function () {
    return (
        <UtilityCard className='p-8 w-full flex-1 mt-4 dark:bg-neutral-800 flex flex-col min-h-0 shadow-lg shadow-black/20'>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mx-4'>
                <ProjectCardskeleton />
                <ProjectCardskeleton />
                <ProjectCardskeleton />
                <ProjectCardskeleton />
                <ProjectCardskeleton />
                <ProjectCardskeleton />
            </div>
        </UtilityCard>
    )
}