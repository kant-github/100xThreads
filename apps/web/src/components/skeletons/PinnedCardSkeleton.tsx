import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export default function () {
    return (
        <div className="relative flex flex-col items-start shadow-lg gap-y-4 select-none  bg-gradient-to-br from-neutral-900 via-[#171717] to-[#171717] rounded-[14px] w-full pt-8 px-5 pb-4 min-h-[10rem]">
            <span className="flex items-center gap-x-1 absolute bottom-2 right-3 text-neutral-500">
                <Skeleton variant="circular" sx={{ bgcolor: '#3a3a3a' }}  width={12} height={12} />
                <Skeleton variant="text" sx={{ bgcolor: '#3a3a3a' }}  width={16} height={10} />
            </span>

            <div className="absolute top-2.5 right-2">
                <Skeleton variant="circular" width={14} height={14} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>

            <div className="flex items-center justify-center gap-x-1 absolute top-2.5 left-3">
                <Skeleton variant="circular" width={12} height={12} sx={{ bgcolor: '#3a3a3a' }} />
                <Skeleton variant="circular" width={12} height={12} sx={{ bgcolor: '#3a3a3a' }} />
            </div>


            <div className="flex flex-col items-start gap-y-1 text-neutral-300 w-full">
                <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: '#3a3a3a' }} />
                <Skeleton variant="text" width="90%" height={14} sx={{ bgcolor: '#3a3a3a' }} />
            </div>

            <div className="flex items-center gap-x-2 mt-2">
                <Skeleton variant="rectangular" width={100} height={24} sx={{ bgcolor: '#3a3a3a' }} />
                <Skeleton variant="rectangular" width={60} height={20} sx={{ bgcolor: '#3a3a3a' }} />
            </div>

            {/* <div className="flex flex-wrap gap-2 w-full">
                <Skeleton variant="rounded" width={50} height={20} />
                <Skeleton variant="rounded" width={40} height={20} />
                <Skeleton variant="rounded" width={60} height={20} />
            </div> */}
        </div>
    );
}
