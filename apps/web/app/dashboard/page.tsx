'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import Footer from "@/components/footer/Footer";
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
        <div className="flex flex-col h-screen">
        {/* Navigation bar */}
        <div className="h-16">
            <DashNav groups={groups} />
        </div>

        {/* Dashboard content takes remaining height */}
        <div className="flex-grow">
            <Dashboard session={session} />
        </div>
    </div>
    );
}
