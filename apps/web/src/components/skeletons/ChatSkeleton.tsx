import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function ChatSkeleton() {
    const chatBubbles = [
        { align: 'left', nameWidth: 100, contentWidth: '80%', contentHeight: 50 },
        { align: 'right', nameWidth: 360, contentWidth: '60%', contentHeight: 50 },
        { align: 'left', nameWidth: 270, contentWidth: '70%', contentHeight: 90 },
        { align: 'right', nameWidth: 330, contentWidth: '65%', contentHeight: 60 },
        { align: 'left', nameWidth: 390, contentWidth: '75%', contentHeight: 70 },
    ];

    return (
        <Box className="flex flex-col gap-6 px-4 pt-12 h-full relative" sx={{ bgcolor: '#262626', borderRadius: 2 }}>
            {chatBubbles.map((bubble, index) => (
                <Box key={index} className={`flex items-start gap-3 ${bubble.align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Skeleton animation="wave" variant="circular" width={45} height={40} sx={{ bgcolor: '#3a3a3a' }} />
                    <Box className={`flex flex-col gap-1 min-w-[70%] max-w-[70%] ${bubble.align === 'right' ? 'items-end' : 'items-start'}`}>
                        <Skeleton animation="wave" variant="text" width={100} height={30} sx={{ bgcolor: '#3a3a3a', borderRadius: '5px' }} />
                        <Skeleton animation="wave" variant="rounded" width={bubble.contentWidth} height={bubble.contentHeight} sx={{ bgcolor: '#3a3a3a' }} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}