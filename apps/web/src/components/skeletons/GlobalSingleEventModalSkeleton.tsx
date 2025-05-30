import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function GlobalSingleEventModalSkeleton() {
    return (
        <Box className="w-8/12 bg-primDark grid grid-cols-4 h-[50%] border-[1px] border-neutral-800 rounded-[6px] relative">
            {/* Left Section - Organization Info */}
            <Box className="border-r-[1px] border-neutral-800 col-span-1 py-6 px-6 flex flex-col justify-between gap-y-2">
                <Box className="flex flex-col gap-y-3">
                    {/* Organization Logo and Name */}
                    <Box className="flex flex-col gap-y-2">
                        <Skeleton
                            animation="wave"
                            variant="circular"
                            width={40}
                            height={40}
                            sx={{ bgcolor: '#3a3a3a' }}
                        />
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width={80}
                            height={24}
                            sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                        />
                    </Box>

                    {/* Event Details */}
                    <Box className="flex flex-col gap-y-3">
                        {/* Duration */}
                        <Box className="flex items-center gap-x-2">
                            <Skeleton
                                animation="wave"
                                variant="circular"
                                width={14}
                                height={14}
                                sx={{ bgcolor: '#3a3a3a' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width={50}
                                height={18}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                            />
                        </Box>

                        {/* Meeting Platform */}
                        <Box className="flex items-center gap-x-2">
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={19}
                                height={19}
                                sx={{ bgcolor: '#3a3a3a' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width={80}
                                height={18}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="circular"
                                width={14}
                                height={14}
                                sx={{ bgcolor: '#3a3a3a' }}
                            />
                        </Box>

                        {/* Start/End Times */}
                        <Box className="flex flex-col gap-y-1.5">
                            <Box className="flex items-center gap-2">
                                <Skeleton
                                    animation="wave"
                                    variant="circular"
                                    width={14}
                                    height={14}
                                    sx={{ bgcolor: '#3a3a3a' }}
                                />
                                <Skeleton
                                    animation="wave"
                                    variant="text"
                                    width={40}
                                    height={16}
                                    sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                                />
                                <Skeleton
                                    animation="wave"
                                    variant="text"
                                    width={90}
                                    height={16}
                                    sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                                />
                            </Box>
                            <Box className="flex items-center gap-2">
                                <Skeleton
                                    animation="wave"
                                    variant="circular"
                                    width={14}
                                    height={14}
                                    sx={{ bgcolor: '#3a3a3a' }}
                                />
                                <Skeleton
                                    animation="wave"
                                    variant="text"
                                    width={35}
                                    height={16}
                                    sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                                />
                                <Skeleton
                                    animation="wave"
                                    variant="text"
                                    width={90}
                                    height={16}
                                    sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* App Logo at bottom */}
                <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={60}
                    height={20}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
            </Box>

            {/* Middle Section - Event Content */}
            <Box className="px-6 col-span-2 py-6 flex flex-col justify-between gap-y-2">
                <Box>
                    {/* Status Badge */}
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={80}
                        height={28}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '20px' }}
                    />

                    {/* Event Title */}
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width="80%"
                        height={32}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '4px', mt: 2 }}
                    />

                    {/* Event Description */}
                    <Box className="mt-2 flex flex-col gap-y-1">
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width="95%"
                            height={18}
                            sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                        />
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width="75%"
                            height={18}
                            sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                        />
                    </Box>

                    {/* Invited Tags Section */}
                    <Box className="mt-3 flex flex-col gap-y-2">
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width={80}
                            height={18}
                            sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                        />
                        <Box className="flex items-center gap-x-2">
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={60}
                                height={24}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '12px' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={70}
                                height={24}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '12px' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={55}
                                height={24}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '12px' }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Event Image at bottom */}
                <Box className="w-full flex justify-end items-center">
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={100}
                        height={100}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>

            {/* Right Section - Action Buttons */}
            <Box className="border-l-[1px] border-neutral-800 col-span-1 py-[22px] px-4 flex flex-col gap-y-2 w-full">
                <Box className="flex gap-x-2">
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={31}
                        height={31}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={31}
                        height={31}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                    />
                </Box>
                <Box>
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={70}
                        height={10}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '12px' }}
                    />
                </Box>
                <Box className="flex flex-col gap-y-1.5 w-full mt-2">
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        className='w-full'
                        height={28}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '8px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        className='w-full'
                        height={28}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '8px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        className='w-full'
                        height={28}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '8px' }}
                    />
                </Box>
            </Box>
        </Box>
    );
}