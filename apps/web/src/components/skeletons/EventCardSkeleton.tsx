import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function EventCardSkeleton() {
    return (
        <Box
            className="p-5 rounded-[6px] border-[1px] overflow-hidden shadow-lg cursor-pointer bg-terDark"
            sx={{
                borderColor: '#404040'
            }}
        >
            <Box className="flex flex-col gap-y-4">
                {/* Title and Status Row */}
                <Box className="flex items-center justify-between">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width="60%"
                        height={24}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '4px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={80}
                        height={28}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '20px' }}
                    />
                </Box>

                {/* Date and Time Info */}
                <Box className="flex flex-col gap-y-2">
                    {/* Date Row */}
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
                            width={120}
                            height={20}
                            sx={{ bgcolor: '#3a3a3a', borderRadius: '3px' }}
                        />
                    </Box>

                    {/* Duration and Attendees Row */}
                    <Box className="ml-0.5 flex flex-col gap-y-1">
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
                                width={80}
                                height={16}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '3px' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="circular"
                                width={12}
                                height={12}
                                sx={{ bgcolor: '#3a3a3a' }}
                            />
                            <Skeleton
                                animation="wave"
                                variant="text"
                                width={90}
                                height={16}
                                sx={{ bgcolor: '#3a3a3a', borderRadius: '3px' }}
                            />
                        </Box>

                        {/* Start Time */}
                        <Skeleton
                            animation="wave"
                            variant="text"
                            width={100}
                            height={16}
                            sx={{ bgcolor: '#3a3a3a', borderRadius: '3px' }}
                        />
                    </Box>
                </Box>

                {/* Location Row */}
                <Box className="flex items-center gap-x-2">
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={19}
                        height={19}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '3px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width="70%"
                        height={16}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '3px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="circular"
                        width={14}
                        height={14}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>
        </Box>
    );
}