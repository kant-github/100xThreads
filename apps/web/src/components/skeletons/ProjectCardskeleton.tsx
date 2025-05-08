import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export default function () {
    return (
        <div className="flex flex-col items-start bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-[14px] px-6 py-4 cursor-pointer max-h-48 w-full">
            {/* Chat icon top right */}
            <div className="absolute right-4 top-4">
                <Skeleton variant="circular" width={20} height={20} sx={{ bgcolor: '#3a3a3a' }} />
            </div>

            {/* Title */}
            <Skeleton variant="text" width="60%" height={48} className="mt-1" sx={{ bgcolor: '#3a3a3a' }} />

            {/* Description */}
            <Skeleton variant="text" width="85%" height={24} className="mb-2" sx={{ bgcolor: '#3a3a3a' }} />

            {/* Timespan */}
            <div className='mt-4 w-full'>
                <Skeleton variant="text" width="50%" height={14} sx={{ bgcolor: '#3a3a3a' }} />
            </div>

            {/* Bottom section: tasks and button */}
            <div className="flex flex-row w-full justify-between items-center mt-5">
                <Skeleton variant="rectangular" width={90} height={20} sx={{ bgcolor: '#3a3a3a' }} />
                <Skeleton variant="text" width={60} height={16} sx={{ bgcolor: '#3a3a3a' }} />
            </div>
        </div>
    );
}
