import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function () {
    return (
        <Box className="flex flex-col justify-center" sx={{ bgcolor: 'zinc-800' }}>
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={142} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={142} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={142} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={142} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={142} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={142} />
        </Box>
    );
}
