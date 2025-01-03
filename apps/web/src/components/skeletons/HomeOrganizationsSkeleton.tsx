import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function () {
    return (
        <Box className="flex flex-wrap gap-x-12 gap-y-4 justify-center" sx={{ bgcolor: 'zinc-800', padding: 2 }}>
            <Skeleton sx={{ bgcolor: "#1c1c1c" }} animation="wave" variant="rounded" width={250} height={118} />
            <Skeleton sx={{ bgcolor: "#1c1c1c" }} animation="wave" variant="rounded" width={250} height={118} />
            <Skeleton sx={{ bgcolor: "#1c1c1c" }} animation="wave" variant="rounded" width={250} height={118} />
            <Skeleton sx={{ bgcolor: "#1c1c1c" }} animation="wave" variant="rounded" width={250} height={118} />
            <Skeleton sx={{ bgcolor: "#1c1c1c" }} animation="wave" variant="rounded" width={250} height={118} />
            <Skeleton sx={{ bgcolor: "#1c1c1c" }} animation="wave" variant="rounded" width={250} height={118} />
        </Box>
    );
}
