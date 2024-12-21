'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'; // For managing fetching state and effect
import { fetchGroups } from "fetch/fetchGroups";
import { fetchRecentGroup } from "fetch/fetchRecentGroups";
import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import Footer from "@/components/footer/Footer";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userTokenAtom } from '@/recoil/atoms/atom';

export default function DashboardPageClient() {
    const { data: session } = useSession();
    const [groups, setGroups] = useState<any[]>([]);
    const [recentGroups, setRecentGroups] = useState<any[]>([]);
    const setUserToken = useSetRecoilState(userTokenAtom);
    const token = useRecoilValue(userTokenAtom);



    useEffect(() => {
        if (session?.user?.token) {
            setUserToken(session.user.token);
        }
        console.log(token);
    }, [session]);

    return (
        <div>
            <DashNav groups={groups} />
            <Dashboard recentGroups={recentGroups} groups={groups.slice(0, 6)} session={session} />
            <Footer />
        </div>
    );
}
