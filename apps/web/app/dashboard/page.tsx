'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import Footer from "@/components/footer/Footer";
import SkeletonDashboard from '@/components/skeletons/DashboardSkeleton';
import { useSetRecoilState } from 'recoil';
import { userTokenAtom } from '@/recoil/atoms/atom';

export default function DashboardPageClient() {
    const { data: session, status } = useSession();
    const setUserToken = useSetRecoilState(userTokenAtom);
    const [groups, setGroups] = useState<any[]>([]);
    const [recentGroups, setRecentGroups] = useState<any[]>([]);

    const sessionToken = useMemo(() => session?.user?.token, [session]);

    useEffect(() => {
        if (sessionToken) {
            setUserToken(sessionToken);
        }
    }, [sessionToken, setUserToken]);

    if (status === 'loading') {
        return <SkeletonDashboard />;
    }

    return (
        <div>
            <DashNav groups={groups} />
            <Dashboard recentGroups={recentGroups} groups={groups.slice(0, 6)} session={session} />
            <Footer />
        </div>
    );
}
