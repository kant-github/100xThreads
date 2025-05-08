import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function () {
    return (
        <Box className="flex flex-col justify-center overflow-hidden dark:bg-neutral-800 mt-4 rounded-[12px]" >
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={92} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={92} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={92} />
            <Skeleton className='border-b-[0.5px] border-zinc-700' sx={{ bgcolor: "zinc-700" }} animation="wave" variant="rounded" width='full' height={92} />
        </Box>
    );
}
