'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import SkeletonDashboard from '@/components/skeletons/DashboardSkeleton';
import { useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';

export default function DashboardPageClient() {
    const { data: session, status } = useSession();
    const setUserSession = useSetRecoilState(userSessionAtom);
    const [groups, setGroups] = useState<any[]>([]);


    const sessionToken = useMemo(() => session, [session]);

    useEffect(() => {
        if (sessionToken) {
            setUserSession(sessionToken);
        }
    }, [sessionToken, setUserSession]);

    if (status === 'loading') {
        return <SkeletonDashboard />;
    }

    return (
        <div className="h-full flex flex-col">
            <div className='h-20'>
                <DashNav groups={groups} />
            </div>
            <div className='flex-grow'>
                <Dashboard session={session} />
            </div>
        </div>
    );
}
