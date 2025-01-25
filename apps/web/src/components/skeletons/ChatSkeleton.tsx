import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function ChatSkeleton() {
    return (
        <Box className="flex flex-col gap-6 px-4 pt-12 h-full relative" sx={{ bgcolor: '#262626', borderRadius: 2 }}>
            <Box className="flex items-start gap-3">
                <Skeleton
                    animation="wave"
                    variant="circular"
                    width={45}
                    height={40}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
                <Box className="flex flex-col gap-1 w-full">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={100}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '5px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="90%"
                        height={60}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>

            {/* Chat Bubble 2 */}
            <Box className="flex items-start gap-3">
                <Skeleton
                    animation="wave"
                    variant="circular"
                    width={45}
                    height={40}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
                <Box className="flex flex-col gap-1 w-full">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={120}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '5px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="30%"
                        height={50}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>

            {/* Chat Bubble 3 */}
            <Box className="flex items-start gap-3">
                <Skeleton
                    animation="wave"
                    variant="circular"
                    width={45}
                    height={40}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
                <Box className="flex flex-col gap-1 w-full">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={90}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '5px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="80%"
                        height={70}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>

            {/* Chat Bubble 4 */}
            <Box className="flex items-start gap-3">
                <Skeleton
                    animation="wave"
                    variant="circular"
                    width={45}
                    height={40}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
                <Box className="flex flex-col gap-1 w-full">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={110}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '5px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="65%"
                        height={60}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>

            {/* Chat Bubble 5 */}
            <Box className="flex items-start gap-3">
                <Skeleton
                    animation="wave"
                    variant="circular"
                    width={45}
                    height={40}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
                <Box className="flex flex-col gap-1 w-full">
                    <Skeleton
                        animation="wave"
                        variant="text"
                        width={130}
                        height={20}
                        sx={{ bgcolor: '#3a3a3a', borderRadius: '5px' }}
                    />
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="45%"
                        height={70}
                        sx={{ bgcolor: '#3a3a3a' }}
                    />
                </Box>
            </Box>
            {/* <Box
                className="absolute bottom-4"
                sx={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 32px)', // Adjust based on the padding
                    px: 0.5,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={40}
                    sx={{ bgcolor: '#3a3a3a' }}
                />
            </Box> */}
        </Box>
    );
}
