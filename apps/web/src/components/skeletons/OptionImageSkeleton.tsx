import Skeleton from "@mui/material/Skeleton";

export default function () {
    return (
        <div className='flex flex-col gap-y-1.5 px-8 py-6 z-[100]'>
            {/* Avatar */}
            <div className='flex items-center justify-center gap-x-2'>
                <Skeleton variant="circular" width={46} height={46} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>

            {/* Name & Active status */}
            <div className="flex flex-row justify-center items-center gap-x-2 mt-2">
                <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: '#3a3a3a' }}  />
                <Skeleton variant="text" width={50} height={14} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>

            {/* Location */}
            <div className="flex justify-center">
                <Skeleton variant="text" width={100} height={14} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>

            {/* Org name + role */}
            <div className='flex items-center justify-center gap-x-2'>
                <Skeleton variant="text" width={70} height={14} sx={{ bgcolor: '#3a3a3a' }}  />
                <Skeleton variant="rectangular" width={40} height={14} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>

            {/* Friend status / buttons */}
            <div className='flex items-end justify-center gap-x-2 mt-2'>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>

            {/* Email */}
            <div className="flex flex-col items-center gap-y-2 justify-center gap-x-4 mt-3">
                <Skeleton variant="text" width={180} height={20} sx={{ bgcolor: '#3a3a3a' }}  />
                <Skeleton variant="text" width={220} height={20} sx={{ bgcolor: '#3a3a3a' }}  />
            </div>
        </div>
    );
}
